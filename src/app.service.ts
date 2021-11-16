import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CoinService } from './coin/coin.service';

@Injectable()
export class AppService {
  constructor(
    private coinService: CoinService,
    private httpService: HttpService,
  ) {}

  async setCoinValue(): Promise<void> {
    this.httpService
      .get(
        'https://api.nomics.com/v1/currencies/ticker?key=5b4403c4d27b6cb1ef1e152abf6a823b288964b4&ids=BTC,ETH,LTC,XRP,BNB&interval=1h&convert=BRL&per-page=5&page=1',
      )
      .subscribe((res) => {
        const price = res.data.map((el) => el.price);

        for (let i = 0; i <= 4; i++) {
          this.coinService.setPrice(i + 1, price[i]);
        }
      });
  }
}
