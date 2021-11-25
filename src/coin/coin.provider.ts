import { Connection } from 'typeorm';
import { Coin } from './coin.entity';

export const coinProviders = [
  {
    provide: 'COIN_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(Coin),
    inject: ['DATABASE_CONNECTION'],
  },
];
