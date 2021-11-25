import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from './auth/auth.module';
import { CoinModule } from './coin/coin.module';
import { InvestimentModule } from './investiment/investiment.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { SendMailService } from './jobs/sendMail-producer.service';
import { SendMailConsumer } from './jobs/sendMail.consumer';
import { AppController } from './app.controller';
import { SendGridModule } from '@anchan828/nest-sendgrid';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: Number(configService.get('REDIS_PORT')),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: 'sendMail',
    }),
    SendGridModule.forRoot({
      apikey: process.env.SEND_GRID_ACCESS_KEY,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: 3306,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      entities: [__dirname, '**', '*.entity.{ts,js}'],
    }),
    UserModule,
    AuthModule,
    CoinModule,
    HttpModule,
    InvestimentModule,
  ],
  controllers: [AppController],
  providers: [SendMailService, SendMailConsumer],
})
export class AppModule {}
