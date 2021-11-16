import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import InvestimentCreateDTO from './dto/investiment-create.dto';
import InvestimentUpdateDTO from './dto/investiment-update.dto';
import { Investiment } from './investiment.entity';

@Injectable()
export class InvestimentService {
  constructor(
    @Inject('INVESTIMENT_REPOSITORY')
    private investimentRepository: Repository<Investiment>,
  ) {}

  async findByUserId(user: User): Promise<Investiment[]> {
    const investiments = await this.investimentRepository.find({
      user,
      isActive: true,
    });

    return investiments;
  }

  async create(investiment: InvestimentCreateDTO): Promise<Investiment> {
    const newInvestiment = new Investiment();

    newInvestiment.user = investiment.user;
    newInvestiment.coin = investiment.coin;
    newInvestiment.value = investiment.value;
    newInvestiment.coinValue = investiment.coinValue;

    const result = await this.investimentRepository.save(newInvestiment);

    return result;
  }

  async update(
    userId: number,
    investimentId: number,
    data: InvestimentUpdateDTO,
  ): Promise<Investiment> {
    const investiment = await this.investimentRepository.findOne({
      where: { id: investimentId },
      relations: ['user'],
    });

    if (!investiment) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Investiment not found',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (investiment.user.id !== userId) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          message: 'Each user can only update his own investiments',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    investiment.value = data.value;

    const result = await this.investimentRepository.save(investiment);

    return result;
  }

  async delete(userId: number, investimentId: number): Promise<void> {
    const investiment = await this.investimentRepository.findOne({
      where: { id: investimentId },
      relations: ['user'],
    });

    if (!investiment) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Investiment not found',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (investiment.user.id !== userId) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          message: 'Each user can only delete his own investiments',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    investiment.endTime = new Date().toISOString();
    investiment.isActive = false;

    await this.investimentRepository.save(investiment);
  }
}
