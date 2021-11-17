import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { classToClass } from 'class-transformer';
import { TokenService } from 'src/token/token.service';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';

type LoginResponse = {
  access_token: string;
};

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private tokenService: TokenService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'User Not Found',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const checkPassword = await compare(password, user.password);

    if (!checkPassword) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Invalid Password',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return classToClass(user);
  }

  async login(user: User): Promise<LoginResponse> {
    const payload = { name: user.name, email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);

    await this.tokenService.save(token, user.email);

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
