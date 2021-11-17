import { Controller, Get, Post } from '@nestjs/common';
import { Coin } from './coin.entity';
import { CoinService } from './coin.service';

@Controller('coin')
export class CoinController {
  constructor(private readonly controllerService: CoinService) {}

  @Get()
  async list(): Promise<Coin[]> {
    const coins = await this.controllerService.list();

    return coins;
  }

  @Post()
  async update(): Promise<void> {
    await this.controllerService.setCoinValue();
  }
}
