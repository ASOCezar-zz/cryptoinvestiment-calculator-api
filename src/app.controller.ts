import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { SendMailService } from './jobs/sendMail-producer.service';
import { UserService } from './user/user.service';

type SendPasswordType = {
  email: string;
};

@Controller()
export class AppController {
  constructor(
    private readonly sendMailService: SendMailService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('forgot-password')
  async sendEmail(@Body() { email }: SendPasswordType): Promise<void> {
    const user = await this.userService.findByEmail(email);

    const { access_token } = await this.authService.login(user);

    await this.sendMailService.sendEmail({ access_token, user });
  }
}
