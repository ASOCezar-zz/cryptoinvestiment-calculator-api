import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { CoinController } from './coin.controller';
import { coinProviders } from './coin.provider';
import { CoinService } from './coin.service';

@Module({
  imports: [DatabaseModule, HttpModule, forwardRef(() => AuthModule)],
  controllers: [CoinController],
  providers: [...coinProviders, CoinService],
  exports: [CoinService],
})
export class CoinModule {}
