import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { classToClass } from 'class-transformer';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import jwtDecode from 'src/utils/jwt-decode';
import { ICreateUserDTO } from './dto/user-create.dto';
import { IUpdateUserDto } from './dto/user-update.dto';
import { User } from './user.entity';
import { ICreateUserReponse, UserService } from './user.service';

type BodyType = {
  email: string;
  password: string;
};

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private authService: AuthService,
  ) {}

  @Get()
  async list(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Post('register')
  async create(@Body() data: ICreateUserDTO): Promise<ICreateUserReponse> {
    const user = await this.userService.create(data);

    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update')
  async update(
    @Request() request: Request,
    @Body() data: IUpdateUserDto,
  ): Promise<ICreateUserReponse> {
    const { id } = jwtDecode(request.headers['authorization']);
    const user = await this.userService.update({ id, data });
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete')
  async delete(@Request() request: Request) {
    const { id } = jwtDecode(request.headers['authorization']);
    await this.userService.delete(id);
  }

  @Post('login')
  async login(@Request() request: Request) {
    const { email, password } = request.body as unknown as BodyType;

    const user = await this.authService.validateUser(email, password);

    const { access_token } = await this.authService.login(user);

    return {
      user: classToClass(user),
      access_token,
    };
  }
}
