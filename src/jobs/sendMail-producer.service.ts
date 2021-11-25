import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { SendMailDTO } from './dto/SendMail';

@Injectable()
export class SendMailService {
  constructor(@InjectQueue('sendMail') private queue: Queue) {}

  async sendEmail({ access_token, user }: SendMailDTO): Promise<void> {
    await this.queue.add('user.password.reset', {
      access_token,
      user,
    });
  }
}
