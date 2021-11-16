import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CoinModule } from './coin/coin.module';
import { InvestimentModule } from './investiment/investiment.module';

@Module({
  imports: [AuthModule, CoinModule, HttpModule, InvestimentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
