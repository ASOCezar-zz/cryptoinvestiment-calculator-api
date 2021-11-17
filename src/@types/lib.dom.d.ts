import { Body } from '@nestjs/common';

declare interface Request extends Body {
  body: {
    email?: string;
    password?: string;
  };
}
