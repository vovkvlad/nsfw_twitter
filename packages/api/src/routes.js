import { getUserIdByName } from './twitter_fetcher.js';

export function initRoutes(fastify) {
  // Declare a route
  fastify.get('/test', function (request, reply) {
    reply.send({ message: 'Server running and looks healthy'});
  });

  fastify.get('/check', async function(request, reply) {
    const userName = request.query?.user_name ?? null;
    if(!userName) {
      fastify.log.error('ERROR: userName has not b een provided to check route');
      const error = new Error('Twitter username has not been provided or wasn\'t parsed correctly');
      reply.code(400).send(error);
    } else {
      try {
        fastify.log.info(`Retrieving userId for the userName: ${userName}`);
        const results = await getUserIdByName(userName);
        reply.code(200).send(results);
      } catch (e) {
        fastify.log.error(e);
        reply.code(e.status).send(`${e?.error?.title}. ${e?.error?.detail}`);
      }
    }
  })
}