import { IsInt, IsISO8601, IsPositive, IsString } from 'class-validator';

class TransactionDto {
  @IsInt()
  valor: number;

  @IsString()
  tipo: 'c' | 'd';

  @IsString()
  descricao: string;

  @IsISO8601()
  performedAt: string;
}

export class ExtractResponseDto {

  ultimas_transacoes: TransactionDto[];

  saldo: {
    total: number,
    limite: number,
    data_extrato: string
  }
}
