import { DataSource } from 'typeorm';
import 'dotenv/config';

const entityPath = new URL('../entities/*.js', import.meta.url).pathname;
const migrationPath = new URL('../migrations/*.js', import.meta.url).pathname;

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.MYSQL_HOST || 'localhost',
  port: parseInt(process.env.MYSQL_PORT) || 3306,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  synchronize: false, // Disabled for migrations
  migrations: [migrationPath], 
  entities: [entityPath]
});