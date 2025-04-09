import 'reflect-metadata';
import { DataSource } from 'typeorm';
import configuration from './config/configuration';
import { JobOffer } from './modules/job-offers/entities/job-offer.entity';

const config = configuration();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.postgresql.host,
  port: config.postgresql.port,
  username: config.postgresql.username,
  password: config.postgresql.password,
  database: config.postgresql.database,
  entities: [JobOffer],
  synchronize: process.env.NODE_ENV == 'dev',
});
