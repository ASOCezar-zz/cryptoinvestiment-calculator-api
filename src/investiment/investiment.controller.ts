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
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Coin } from 'src/coin/coin.entity';
import { CoinService } from 'src/coin/coin.service';
import { UserService } from 'src/user/user.service';
import jwtDecode from 'src/utils/jwt-decode';
import InvestimentCreateDTO from './dto/investiment-create.dto';
import InvestimentUpdateDTO from './dto/investiment-update.dto';
import { Investiment } from './investiment.entity';
import { InvestimentService } from './investiment.service';

type CreateInvestimentBodyType = {
  coin_id: Coin['id'];
  value: number;
};

@Controller('investiments')
export class InvestimentController {
  constructor(
    private readonly investimentService: InvestimentService,
    private userService: UserService,
    private coinService: CoinService,
    private authService: AuthService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async list(@Request() request: Request): Promise<Investiment[]> {
    const { id } = jwtDecode(request.headers['authorization']);

    const user = await this.userService.findById(+id);

    const investiments = await this.investimentService.findByUserId(user);

    return investiments;
  }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(
    @Body() data: CreateInvestimentBodyType,
    @Request() request: Request,
  ): Promise<Investiment> {
    const { id } = jwtDecode(request.headers['authorization']);

    const user = await this.userService.findById(+id);
    const coin = await this.coinService.findById(data.coin_id);

    const investiment: InvestimentCreateDTO = {
      user,
      coin,
      coinValue: coin.price,
      value: data.value,
    };

    const result = await this.investimentService.create(investiment);

    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update/:id')
  async update(
    @Request() request: Request,
    @Body() data: InvestimentUpdateDTO,
    @Param('id') investimentId: number,
  ): Promise<Investiment> {
    const { id } = jwtDecode(request.headers['authorization']);

    const investiment = await this.investimentService.update(
      +id,
      investimentId,
      data,
    );

    return investiment;
  }

  // criar o metodo delete
  @UseGuards(JwtAuthGuard)
  @Delete('delete/:id')
  async delete(
    @Param('id') investimentId: number,
    @Request() request: Request,
  ): Promise<void> {
    const { id } = jwtDecode(request.headers['authorization']);

    await this.investimentService.delete(+id, investimentId);
  }
}
