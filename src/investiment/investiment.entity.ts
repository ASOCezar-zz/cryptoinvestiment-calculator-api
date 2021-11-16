import { Coin } from 'src/coin/coin.entity';
import { User } from 'src/user/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Investiment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => User, (investiment) => Investiment)
  user: User;

  @ManyToOne((type) => Coin, (investiment) => Investiment)
  coin: Coin;

  @Column({ type: 'double', precision: 10, scale: 2 })
  coinValue: number;

  @Column({ type: 'double', precision: 10, scale: 2 })
  value: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', default: null, nullable: true })
  endTime: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
