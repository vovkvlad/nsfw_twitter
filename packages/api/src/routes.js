import { searchUserMedia } from './twitter_fetcher.js';
import {
  getPredictionsFromTwitterResponse,
  filterPredictions,
} from './predictor.js';

export function initRoutes(fastify) {
  // Declare a route
  fastify.get('/test', function (request, reply) {
    reply.send({ message: 'Server running and looks healthy' });
  });

  fastify.get('/check', async function (request, reply) {
    console.time('HTTP_REQUEST');
    const userName = request.query?.user_name ?? null;

    if (!userName) {
      request.log.error(
        'ERROR: userName has not been provided to check route'
      );
      const error = new Error(
        'Twitter username has not been provided or was not parsed correctly'
      );
      reply.code(400).send(error);
    } else {
      try {
        fastify.log.info(`Retrieving userId for the userName: ${userName}`);

        try {
          const twitterResponse = await searchUserMedia(userName);

          try {
            const dataWithPredictions = await getPredictionsFromTwitterResponse(
              twitterResponse,
              fastify.nsfw_model
            );

            // TODO parameterize these thresholds
            const filteredData = filterPredictions(dataWithPredictions, {
              Sexy: 0.52,
              Porn: 0.4,
              Hentai: 0.6,
            });
            reply.code(200).send(filteredData);
            console.timeEnd('HTTP_REQUEST');
          } catch (predictorError) {
            fastify.log.error(
              'Error has occurred during prediction phase. Details:',
              predictorError
            );
            reply.code(500).send(predictorError);
          }
        } catch (twitterFetchError) {
          fastify.log.error(
            'Error has occurred during fetching twitter API. Error:'
          );
          fastify.log.error(twitterFetchError);
          reply.code(500).send(twitterFetchError);
        }
      } catch (e) {
        fastify.log.error(e);
        reply.code(e.status).send(`${e?.error?.title}. ${e?.error?.detail}`);
      }
    }
  });
}
