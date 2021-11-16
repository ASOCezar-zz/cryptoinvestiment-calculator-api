import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Coin } from './coin.entity';

@Injectable()
export class CoinService {
  constructor(
    @Inject('COIN_REPOSITORY')
    private coinRepository: Repository<Coin>,
  ) {}

  async findByName(name: string): Promise<Coin> {
    const coin = await this.coinRepository.findOne({ name });

    if (!coin) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Coin Not Found',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return coin;
  }

  async findById(id: number): Promise<Coin> {
    const coin = await this.coinRepository.findOne({ id });

    if (!coin) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Coin Not Found',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return coin;
  }

  async setPrice(id: number, price: number): Promise<void> {
    const coin = await this.coinRepository.findOne({ id });

    coin.price = price;

    console.log(id);

    await this.coinRepository.save(coin);
  }
}
