import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { CoinController } from './coin.controller';
import { Coin } from './coin.entity';

import { CoinService } from './coin.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Coin]),
    HttpModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [CoinController],
  providers: [CoinService],
  exports: [CoinService],
})
export class CoinModule {}
