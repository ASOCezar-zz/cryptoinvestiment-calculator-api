import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coin } from './coin.entity';

@Injectable()
export class CoinService {
  constructor(
    @InjectRepository(Coin)
    private coinRepository: Repository<Coin>,
    private httpService: HttpService,
  ) {}

  async list(): Promise<Coin[]> {
    const coins = await this.coinRepository.find();

    return coins;
  }

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

    await this.coinRepository.save(coin);
  }

  async setCoinValue(): Promise<void> {
    this.httpService
      .get(
        'https://api.nomics.com/v1/currencies/ticker?key=5b4403c4d27b6cb1ef1e152abf6a823b288964b4&ids=BTC,ETH,LTC,XRP,BNB&interval=1h&convert=BRL&per-page=5&page=1',
      )
      .subscribe((res) => {
        const price = res.data.map((el) => el.price);

        for (let i = 0; i <= 4; i++) {
          this.setPrice(i + 1, price[i]);
        }
      });
  }
}
