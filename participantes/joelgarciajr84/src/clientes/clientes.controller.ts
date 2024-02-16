import { Body, Controller, Get, HttpCode, Param, ParseIntPipe, Post, UseInterceptors } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { CreateTransactionDto } from './create-transaction.dto';
import { ExtractResponseDto } from './extract-response.dto';

@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Post(':id/transacoes')
  @HttpCode(200)
  async createTransaction(
    @Param('id', ParseIntPipe) clientId: number,
    @Body() createTransactionDto: CreateTransactionDto,
  ) {
    return await this.clientesService.createTransaction(clientId, createTransactionDto)
  }

  @Get(':id/extrato')
  async getExtract(@Param('id', ParseIntPipe) clientId: number): Promise<ExtractResponseDto> {

    return await this.clientesService.getExtract(clientId)
  }
}
