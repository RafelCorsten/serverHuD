import { Sequelize } from 'sequelize-typescript'
import { User } from './user.model';
const {DATABASE_TEST, DATABASE, NODE_ENV} = process.env;

export const sequelize = new Sequelize({
  database: NODE_ENV === 'test' ? DATABASE_TEST : DATABASE,
  dialect: 'postgres',
  logging: false,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PW,
})

sequelize.addModels([User]);
