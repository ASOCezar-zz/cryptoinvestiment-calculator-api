import { SendGridService } from '@anchan828/nest-sendgrid';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { SendMailDTO } from './dto/SendMail';

@Processor('sendMail')
export class SendMailConsumer {
  constructor(private mailService: SendGridService) {}

  @Process('user.password.reset')
  async sendMailJob(job: Job<SendMailDTO>) {
    await this.mailService.send({
      to: job.data.user.email,
      from: process.env.FROM_EMAIL,
      subject: 'Recuperacao de Senha',
      html: `<p>Olá ${job.data.user.name}! Acesse o link abaixo para resetar a sua senha</p>
      <p><a href='http://localhost:3000/login/nova-senha?t=${job.data.access_token}'>Clique Aqui</a></p>`,
    });
  }
}
