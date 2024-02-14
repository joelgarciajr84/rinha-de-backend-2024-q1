import { Module } from '@nestjs/common';
import { ClientesModule } from './clientes/clientes.module';
import { MongoModule } from './mongo/mongo.module';

@Module({
  imports: [MongoModule,ClientesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
