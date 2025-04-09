import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

export class Company {
  @Column()
  name!: string;

  @Column({ nullable: true })
  website!: string | null;

  @Column({ nullable: true })
  industry!: string | null;
}

export class Compensation {
  @Column('float')
  min!: number;

  @Column('float')
  max!: number;

  @Column()
  currency!: string;
}

@Entity()
@Index(['provider', 'providerId'], { unique: true })
export class JobOffer {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  provider!: number;

  @Column()
  providerId!: string;

  @Column()
  position!: string;

  @Column(() => Company)
  company!: Company;

  @Column(() => Compensation)
  compensation!: Compensation;

  @Column('text', { array: true })
  skills!: string[];

  @Column({ type: 'int', nullable: true })
  experience!: number | null;

  @Column()
  city!: string;

  @Column()
  state!: string;

  @Column({ type: 'boolean', nullable: true })
  remote!: boolean | null;

  @Column({ type: 'timestamptz' })
  postDate!: Date;
}
