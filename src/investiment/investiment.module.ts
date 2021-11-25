import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { CoinModule } from 'src/coin/coin.module';
import { UserModule } from 'src/user/user.module';
import { InvestimentController } from './investiment.controller';
import { Investiment } from './investiment.entity';
import { InvestimentService } from './investiment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Investiment]),
    UserModule,
    CoinModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [InvestimentController],
  providers: [InvestimentService],
  exports: [InvestimentService],
})
export class InvestimentModule {}
