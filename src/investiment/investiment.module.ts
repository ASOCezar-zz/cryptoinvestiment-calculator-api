import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { CoinModule } from 'src/coin/coin.module';
import { UserModule } from 'src/user/user.module';
import { DatabaseModule } from '../database/database.module';
import { InvestimentController } from './investiment.controller';
import { investimentProviders } from './investiment.providers';
import { InvestimentService } from './investiment.service';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    CoinModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [InvestimentController],
  providers: [...investimentProviders, InvestimentService],
  exports: [InvestimentService],
})
export class InvestimentModule {}
