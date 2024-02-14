import { BadRequestException, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateTransactionDto } from './create-transaction.dto';

@Injectable()
export class ValidationService {
  public isRinhaCustomer(clientId: number) {
    if (clientId > 5) {
      throw new BadRequestException();
    }
  }

  public validateTransaction(createTransactionDto: CreateTransactionDto) {
    if (
      !createTransactionDto.valor ||
      !createTransactionDto.tipo ||
      !createTransactionDto.descricao
    ) {
      throw new UnprocessableEntityException('');
    }

    if (typeof createTransactionDto.valor !== 'number' || !Number.isInteger(createTransactionDto.valor)) {
      throw new UnprocessableEntityException('');
    }

    if (
      createTransactionDto.descricao.length < 1 ||
      createTransactionDto.descricao.length > 10
    ) {
      throw new UnprocessableEntityException('');
    }

    if (
      createTransactionDto.tipo !== 'c' &&
      createTransactionDto.tipo !== 'd'
    ) {
      throw new UnprocessableEntityException('');
    }
  }
}
