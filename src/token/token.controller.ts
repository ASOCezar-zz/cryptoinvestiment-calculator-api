import { Body, Controller, Put } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';
import { ITokenRefreshDTO } from './dto/token-refresh.dto';
import { Token } from './token.entity';
import { TokenService } from './token.service';

@Controller('token')
export class TokenController {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Put('refresh')
  async refresh(@Body() data: ITokenRefreshDTO): Promise<Token> {
    const existsToken = await this.tokenService.findOne(data.oldToken);

    const user = await this.userService.findByEmail(existsToken.email);

    const { access_token } = await this.authService.login(user);

    return await this.tokenService.save(access_token, user.email);
  }
}
