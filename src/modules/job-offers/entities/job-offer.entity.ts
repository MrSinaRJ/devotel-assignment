import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

export class Company {
  @ApiProperty({
    description: 'Company name',
    example: 'Devotel Inc.',
  })
  @Column()
  name!: string;

  @ApiProperty({
    description: 'Company website URL',
    example: 'https://example.com',
    required: false,
    nullable: true,
  })
  @Column({ nullable: true, type: 'varchar' }) // explicitly state type
  website!: string | null;

  @ApiProperty({
    description: 'Company industry',
    example: 'Technology',
    required: false,
    nullable: true,
  })
  @Column({ nullable: true, type: 'varchar' })
  industry!: string | null;
}

export class Compensation {
  @ApiProperty({
    description: 'Minimum compensation amount',
    example: 90000,
  })
  @Column('float')
  min!: number;

  @ApiProperty({
    description: 'Maximum compensation amount',
    example: 120000,
  })
  @Column('float')
  max!: number;

  @ApiProperty({
    description: 'Compensation currency',
    example: 'USD',
  })
  @Column({ type: 'varchar' })
  currency!: string;
}

@Entity()
@Index(['provider', 'providerId'], { unique: true })
export class JobOffer {
  @ApiProperty({
    description: 'Unique identifier for the job offer',
    example: 123,
  })
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({
    description: 'Provider identifier (1, 2, etc.)',
    example: 1,
  })
  @Column()
  provider!: number;

  @ApiProperty({
    description: 'Original ID from the provider',
    example: 'abc123',
  })
  @Column()
  providerId!: string;

  @ApiProperty({
    description: 'Job title/position',
    example: 'Senior Software Engineer',
  })
  @Column()
  position!: string;

  @ApiProperty({
    description: 'Company information',
    type: Company,
  })
  @Column(() => Company)
  company!: Company;

  @ApiProperty({
    description: 'Compensation information',
    type: Compensation,
  })
  @Column(() => Compensation)
  compensation!: Compensation;

  @ApiProperty({
    description: 'Required skills for the position',
    example: ['JavaScript', 'TypeScript', 'Node.js'],
    type: [String],
  })
  @Column('text', { array: true })
  skills!: string[];

  @ApiProperty({
    description: 'Required years of experience',
    example: 5,
    required: false,
    nullable: true,
  })
  @Column({ type: 'int', nullable: true })
  experience!: number | null;

  @ApiProperty({
    description: 'Job location city',
    example: 'San Francisco',
  })
  @Column()
  city!: string;

  @ApiProperty({
    description: 'Job location state',
    example: 'CA',
  })
  @Column()
  state!: string;

  @ApiProperty({
    description: 'Indicates if the job is remote',
    example: true,
    required: false,
    nullable: true,
  })
  @Column({ type: 'boolean', nullable: true })
  remote!: boolean | null;

  @ApiProperty({
    description: 'Date when the job was posted',
    example: '2022-01-01T00:00:00Z',
  })
  @Column({ type: 'timestamptz' })
  postDate!: Date;
}
