import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import jwtDecode from 'src/utils/jwt-decode';
import { ICreateUserDTO } from './dto/user-create.dto';
import { IUpdateUserDto } from './dto/user-update.dto';
import { User } from './user.entity';
import { ICreateUserReponse, UserService } from './user.service';

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

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
