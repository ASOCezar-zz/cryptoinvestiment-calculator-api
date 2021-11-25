import { Investiment } from 'src/investiment/investiment.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class Coin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @OneToMany((type) => Investiment, (coin) => Coin)
  investiments: Investiment[];

  @Column({ type: 'double', precision: 10, scale: 2, default: 0 })
  price: number;

  @UpdateDateColumn()
  updated_at: Date;
}
