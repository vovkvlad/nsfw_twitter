import process from 'node:process';
import { fmt, italic, bold } from 'telegraf/format';
import axios from 'axios';

import { logger } from '../logger.js';

export async function twitter_profile_by_url(ctx) {
  const userName = ctx.match[1];
  if (userName) {
    ctx.reply(
      fmt`URL parsed. Searching for the NSFW media files of the user ${italic`${bold`${userName}`}`}.
Please note it can take a few minutes ⏳`
    );
    // hardcoding for now
    try {
      const response = await axios.get('/check', {
        baseURL: `http://${process.env.API_HOST}:${process.env.API_SERVER_PORT}`,
        params: {
          user_name: userName,
        },
      });

      if(response.data.length > 0) {
        response.data.forEach((tweetItem) => {
          tweetItem.predictions.forEach((item) => ctx.reply(item.imgUrl));
          // const tweetURL = `https://twitter.com/${userName}/status/${tweetItem.tweetId}`;
        });
      } else {
        ctx.reply('Seems like this user has not posted any 🍓 within last 7 days.');
      }
    } catch (error) {
      logger.error(`ERROR REACHING API: ${JSON.stringify(error)}`);
      ctx.reply(
        'Something went wrong and probably broken 🫠. Sorry, buddy, not this time 😥'
      );
    }
  } else {
    logger.error(`ERROR PARSING USERNAME. Message: ${ctx.message.text}`);s
    ctx.reply(
      'Sorry, username was not parsed correctly. Cannot search for twitter user without valid twitter user_name 😥'
    );
  }
}
