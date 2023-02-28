import Fastify from 'fastify';
import process from 'node:process';
import path from 'node:path';
import * as dotenv from 'dotenv';

import { initRoutes } from './routes.js';

if (process.env.NODE_ENV === 'development') {
  dotenv.config({ path: path.resolve('../../.env') });
}

const fastify = Fastify({
  logger: true,
});

initRoutes(fastify);

fastify.listen(
  { port: process.env.API_SERVER_PORT, host: '0.0.0.0' },
  function (error, address) {
    if (error) {
      fastify.log.error(error);
      process.exit(1);
    } else {
      fastify.log.info(`API server has started. Listening on ${address}`);
    }
  }
);
