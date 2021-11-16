import { Connection } from 'typeorm';
import { Investiment } from './investiment.entity';

export const investimentProviders = [
  {
    provide: 'INVESTIMENT_REPOSITORY',
    useFactory: (connection: Connection) =>
      connection.getRepository(Investiment),
    inject: ['DATABASE_CONNECTION'],
  },
];
