import { Injectable } from '@nestjs/common';

@Injectable()
export class MongoConfigService {
  get uri(): string {
    const database = 'rinha';
    const host = 'mongo';
    const port = '27017';
    return `mongodb://${host}:${port}/${database}`;
  }
}
