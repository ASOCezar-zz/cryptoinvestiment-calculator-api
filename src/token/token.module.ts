import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { TokenController } from './token.controller';
import { Token } from './token.entity';
import { TokenService } from './token.service';

@Module({
  providers: [TokenService],
  imports: [
    TypeOrmModule.forFeature([Token]),
    UserModule,
    ConfigModule.forRoot(),
    forwardRef(() => AuthModule),
  ],
  controllers: [TokenController],
  exports: [TokenService],
})
export class TokenModule {}
