require('dotenv').config();
import Koa from 'koa';
import http from 'http';
import { sequelize } from './Models/index';
import router from './Router/routes';
import koaBody from 'koa-body';
import logger from 'koa-logger';
import cors from '@koa/cors';

const app = new Koa();
//app.use(logger());

app.use(cors());
app.use(koaBody());
app.use(router.routes());

(async () => {
  await sequelize.sync();
})();

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port:${PORT}`);
});


module.exports = {
  app,
  server
};