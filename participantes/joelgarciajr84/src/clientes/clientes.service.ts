import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  UnprocessableEntityException,
  NotFoundException,
} from '@nestjs/common';
import { Model, Document, ClientSession } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ExtractResponseDto } from './extract-response.dto';
import { CreateTransactionDto } from './create-transaction.dto';
import { ValidationService } from './validations.service';

interface ClienteDocument extends Document {
  _doc: {
    id: number;
    saldo: number;
    limite: number;
  };
}

interface TransacoesDocument extends Document {
  _doc: {
    clienteid: number;
    valor: number;
    tipo: number;
    descricao: string;
  };
}

@Injectable()
export class ClientesService {
  constructor(
    @InjectModel('clientes')
    private readonly clienteModel: Model<ClienteDocument>,
    @InjectModel('transacoes')
    private readonly transacoesModel: Model<TransacoesDocument>,
    private readonly validations: ValidationService,
  ) {}

  async createTransaction(
    clientId: number,
    createTransactionDto: CreateTransactionDto,
  ): Promise<any> {
    if (clientId > 5) {
      throw new NotFoundException();
    }

    try {
      this.validations.validateTransaction(createTransactionDto);

      const cliente_session = await this.clienteModel.startSession();

      const cliente = await this.findClienteWithSession(
        clientId,
        cliente_session,
      );

      const { limite, saldo } = cliente._doc;

      this.checkBalanceStatus(limite, saldo, createTransactionDto);

      const transaction = await this.makeTransaction(
        cliente,
        createTransactionDto,
      );

      cliente._doc.saldo = transaction.novoSaldo;

      await cliente_session.withTransaction(
        async () => {
          const result = await this.saveClienteWithSession(
            cliente,
            cliente_session,
          );
          return result;
        },
        {
          readPreference: 'primary',
          readConcern: { level: 'local' },
          writeConcern: { w: 'majority' },
        },
      );

      await cliente_session.endSession();

      return {
        limite: cliente._doc.limite,
        saldo: transaction.novoSaldo,
      };
    } catch (error) {
      console.log(JSON.stringify(error));
      throw error;
    }
  }

  async getExtract(clientId: number): Promise<ExtractResponseDto> {
    if (clientId > 5) {
      throw new NotFoundException();
    }
    const cliente_session = await this.clienteModel.startSession();
    const cliente = await this.findClienteWithSession(
      clientId,
      cliente_session,
    );
    await cliente_session.endSession();

    const transacoes_session = await this.transacoesModel.startSession();
    const transactions = await this.getLastTransactions(
      clientId,
      transacoes_session,
    );
    await transacoes_session.endSession();
    const extract: ExtractResponseDto = {
      saldo: {
        total: cliente._doc.saldo,
        limite: cliente._doc.limite,
        data_extrato: new Date().toISOString(),
      },
      ultimas_transacoes: transactions,
    };

    return extract;
  }

  private async getLastTransactions(
    clientid: number,
    session: ClientSession,
  ): Promise<any> {
    try {
      const lastTransactions = this.transacoesModel
        .find({
          clienteID: clientid,
        })
        .session(session)
        .sort({ realizada_em: -1 })
        .limit(10);

      return lastTransactions;
    } catch (error) {
      throw new InternalServerErrorException(JSON.stringify(error));
    }
  }

  private async findClienteWithSession(
    clientId: number,
    session: ClientSession,
  ): Promise<ClienteDocument> {
    const cliente = await this.clienteModel
      .findOne({ id: clientId })
      .session(session)
      .exec();

    return cliente;
  }

  private async saveClienteWithSession(
    cliente: ClienteDocument,
    session: ClientSession,
  ) {
    try {
      cliente.markModified('saldo');
      await cliente.save({ session, wtimeout: 20000 });
    } catch (error) {
      await cliente.save({ session, wtimeout: 20000 });
      throw new InternalServerErrorException(JSON.stringify(error));
    }
  }

  private checkBalanceStatus(
    limite: number,
    saldo: number,
    createTransactionDto: CreateTransactionDto,
  ) {
    const maxTotalAllowed = limite + saldo;

    if (
      createTransactionDto.tipo === 'd' &&
      createTransactionDto.valor > maxTotalAllowed
    ) {
      throw new UnprocessableEntityException('');
    }
  }

  private async makeTransaction(
    cliente: ClienteDocument,
    createTransactionDto: CreateTransactionDto,
  ) {
    try {
      const novoSaldo =
        cliente._doc.saldo +
        (createTransactionDto.tipo === 'c'
          ? createTransactionDto.valor
          : -createTransactionDto.valor);

      const response = {
        transaction: {
          clienteID: cliente._doc.id,
          valor: createTransactionDto.valor,
          tipo: createTransactionDto.tipo,
          descricao: createTransactionDto.descricao,
          realizada_em: new Date().toISOString(),
        },
        novoSaldo,
      };

      const session = await this.transacoesModel.startSession();

      await session.withTransaction(
        async () => {
          const result = await this.transacoesModel.collection.insertOne(
            response.transaction,
          );
          return result;
        },
        {
          readPreference: 'primary',
          readConcern: { level: 'local' },
          writeConcern: { w: 'majority' },
        },
      );

      session.endSession();

      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
