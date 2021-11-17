import { Body, Controller, Post, Put } from '@nestjs/common';
import { classToClass } from 'class-transformer';
import { verify } from 'jsonwebtoken';
import { AuthService } from 'src/auth/auth.service';
import { jwtConstants } from 'src/auth/constants';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { ITokenRefreshDTO } from './dto/token-refresh.dto';
import { Token } from './token.entity';
import { TokenService } from './token.service';

type DataType = {
  hash: string;
};

@Controller('token')
export class TokenController {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  async getUser(@Body() { hash }: DataType): Promise<User> {
    const existsToken = await this.tokenService.findOne(hash);

    const user = await this.userService.findByEmail(existsToken.email);

    return classToClass(user);
  }

  @Put('refresh')
  async refresh(@Body() data: ITokenRefreshDTO): Promise<Token> {
    const existsToken = await this.tokenService.findOne(data.oldToken);

    const user = await this.userService.findByEmail(existsToken.email);

    const { access_token } = await this.authService.login(user);

    return await this.tokenService.save(access_token, user.email);
  }
}
