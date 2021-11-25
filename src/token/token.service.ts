import {
  Injectable,
  Inject,
  HttpException,
  HttpStatus,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { Token } from './token.entity';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,

    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,

    private userService: UserService,
  ) {}

  async findOne(hash: string): Promise<Token> {
    const validToken = await this.tokenRepository.findOne({ hash: hash });

    if (!validToken) {
      throw new HttpException(
        { status: HttpStatus.FORBIDDEN, message: 'Invalid or Expired Token' },
        HttpStatus.FORBIDDEN,
      );
    }

    return validToken;
  }

  async save(hash: string, email: string) {
    const savedToken = await this.tokenRepository.findOne({ email });

    if (!savedToken) {
      await this.tokenRepository.insert({
        hash,
        email,
      });
    } else {
      await this.tokenRepository.update(savedToken.id, {
        hash,
      });
    }

    return savedToken;
  }
}
