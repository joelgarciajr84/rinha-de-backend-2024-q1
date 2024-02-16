import { Module } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { ClientesController } from './clientes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ValidationService } from './validations.service';

@Module({
  imports: [
    
    MongooseModule.forFeature([{ name: 'clientes', schema: {} }]),
    MongooseModule.forFeature([{ name: 'transacoes', schema: {} }]),
  ],
  controllers: [ClientesController],
  providers: [ClientesService, ValidationService],
})
export class ClientesModule {}
