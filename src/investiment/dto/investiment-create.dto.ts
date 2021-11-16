import { Coin } from 'src/coin/coin.entity';
import { User } from 'src/user/user.entity';

export default interface InvestimentCreateDTO {
  user: User;
  coin: Coin;
  coinValue: Coin['price'];
  value: number;
}
