import { Module } from '@nestjs/common';
import { MongoConfigService } from './mongo-config.service';

@Module({
  providers: [MongoConfigService],
  exports: [MongoConfigService],
})
export class MongoConfigModule {}