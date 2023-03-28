import Fastify from 'fastify';
import process from 'node:process';
import path from 'node:path';
import * as dotenv from 'dotenv';
import * as nsfw from 'nsfwjs';

import { initRoutes } from './routes.js';

if (process.env.NODE_ENV === 'development') {
  dotenv.config({ path: path.resolve('../../.env') });
}

const fastify = Fastify({
  logger: true,
});

async function initModel() {
  return nsfw.load();
}

initRoutes(fastify);

fastify.log.info('Waiting for model to initialize');
const model = await initModel();
fastify.log.info('NSFW Model initialized');

fastify.decorate('nsfw_model', model);

fastify.listen(
  { port: process.env.API_SERVER_PORT, host: '0.0.0.0' },
  function (error) {
    if (error) {
      fastify.log.error(error);
      process.exit(1);
    }
  }
);
