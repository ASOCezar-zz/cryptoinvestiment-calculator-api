import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { coinProviders } from './coin.provider';
import { CoinService } from './coin.service';

@Module({
  imports: [DatabaseModule, forwardRef(() => AuthModule)],
  controllers: [],
  providers: [...coinProviders, CoinService],
  exports: [CoinService],
})
export class CoinModule {}
