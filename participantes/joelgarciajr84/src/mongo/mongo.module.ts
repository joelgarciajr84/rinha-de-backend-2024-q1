// mongo.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoConfigModule } from './mongo-config.module';
import { MongoConfigService } from './mongo-config.service';
import mongoose from 'mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [MongoConfigModule],
      useFactory: async (configService: MongoConfigService) => ({
        uri: configService.uri,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoIndex: false,
      }),
      inject: [MongoConfigService],
    }),
    MongooseModule.forFeature([
      {
        name: 'Clientes',
        schema: new mongoose.Schema({
          id: { type: Number, required: true },
          saldo: { type: Number, required: true },
          limite: { type: Number, required: true },
        }),
      },
      {
        name: 'Transacoes',
        schema: new mongoose.Schema({
          clienteid: { type: Number, required: true },
          valor: { type: String, required: true },
          tipo: { type: String, required: true },
          descricao: { type: String, required: true },
        }),
      },
    ]),
  ],
})
export class MongoModule {}
