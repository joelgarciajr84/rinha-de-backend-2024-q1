// import { HttpStatus } from '@nestjs/common';
import { IsInt, IsPositive, IsIn, IsNotEmpty, Length } from 'class-validator';

export class CreateTransactionDto {
  // @IsInt()
  clientId: number;

  // @IsInt()
  // @IsPositive()
  valor: number;

  // @IsIn(['c', 'd'])
  tipo: 'c' | 'd';

  // @IsNotEmpty()
  // @Length(1, 10)
  descricao: string;
}


export class CreateTransactionResponseDto {
  @IsInt()
  saldo: number;

  @IsInt()
  @IsPositive()
  limite: number;
}
