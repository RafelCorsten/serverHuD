require('dotenv').config();
import Koa from 'koa';
import http from 'http';
import { sequelize } from './Models/index';
import router from './Router/routes';
import koaBody from 'koa-body';
import logger from 'koa-logger';
import cors from '@koa/cors';


const bootServer = (port: string): http.Server => {
  const app = new Koa();
  //app.use(logger());

  app.use(cors());
  app.use(koaBody());
  app.use(router.routes());

  (async () => {
    await sequelize.sync();
  })();

  const server = app.listen(port, () => {
    console.log(`Server is running on port:${port}`);
  });

  return server;
}

module.exports = bootServer;