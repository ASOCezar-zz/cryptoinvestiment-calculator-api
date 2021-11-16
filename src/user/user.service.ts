import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { compare, hash } from 'bcrypt';
import { ICreateUserDTO } from './dto/user-create.dto';
import { User } from './user.entity';
import { IUpdateUserDto } from './dto/user-update.dto';
import { classToClass } from 'class-transformer';

export interface ICreateUserReponse {
  id: number;
  name: string;
  email: string;
  created_at: Date;
  updated_at: Date;
}

export interface IUpdateUserProps {
  data: IUpdateUserDto;
  id: string;
}

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return classToClass(this.userRepository.find());
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ email });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'User Not Found',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return user;
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ id });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'User Not Found',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return user;
  }

  async create(data: ICreateUserDTO): Promise<ICreateUserReponse> {
    const user = new User();

    if (data.password !== data.confirmPassword) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Password and Confirmation Does Not Match',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const emailInUse = await this.userRepository.findOne({ email: data.email });

    if (emailInUse) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Email Already in Use',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = (await hash(data.password, 8)) as string;

    user.name = data.name;
    user.email = data.email;
    user.password = hashedPassword;

    const result = await this.userRepository.save(user);

    const { password, ...userInfos } = result;

    return userInfos;
  }

  async update({ id, data }: IUpdateUserProps): Promise<ICreateUserReponse> {
    const user = await this.userRepository.findOne(id);

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'User Not Found',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (data.email) {
      const emailInUse = await this.userRepository.findOne({
        email: data.email,
      });

      if (emailInUse) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Email Already in Use',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      user.email = data.email;
    }

    if (data.password && !data.oldPassword) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Old Password Required',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (data.password && data.oldPassword) {
      const checkOldPassword = await compare(data.oldPassword, user.password);

      if (!checkOldPassword) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Old Password Invalid',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (data.password && !data.confirmPassword) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Password Confirmation Required',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (data.password && data.confirmPassword) {
      if (data.password !== data.confirmPassword) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Password and Confirmation Does Not Match',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      user.password = await hash(data.password, 8);
    }

    if (data.name) {
      user.name = data.name;
    }

    await this.userRepository.save(user);
    return classToClass(user);
  }

  async delete(id: string) {
    await this.userRepository.delete(id);
  }
}
