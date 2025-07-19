import { DataSource } from 'typeorm';
import 'dotenv/config';

const entityPath = new URL('../entities/*.js', import.meta.url).pathname;
const entities = [entityPath];

export const AppDataSource = new DataSource({
  type: 'mssql',
  host: process.env.AZURE_SQL_SERVER,
  port: 1433,
  username: process.env.AZURE_SQL_USER,
  password: process.env.AZURE_SQL_PASSWORD,
  database: process.env.AZURE_SQL_DATABASE,
  synchronize: true, // Set to false in production
  entities, 
  options: { encrypt: true }
});