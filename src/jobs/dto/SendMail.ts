import { User } from 'src/user/user.entity';

export interface SendMailDTO {
  access_token: string;
  user: User;
}
