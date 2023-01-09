import { fmt, italic, bold } from 'telegraf/format';
import axios from 'axios';

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
        baseURL: 'http://127.0.0.1:3000',
        params: {
          user_name: userName,
        },
      });
      response.data.forEach(tweetItem => {
        tweetItem.predictions.forEach(item => ctx.reply(item.imgUrl));
        // const tweetURL = `https://twitter.com/${userName}/status/${tweetItem.tweetId}`;
      });
    } catch (error) {
      ctx.reply(
        'Something went wrong and probably broken 🫠. Sorry, buddy, not this time 😥'
      );
    }
  } else {
    ctx.reply(
      'Sorry, username was not parsed correctly. Cannot search for twitter user without valid twitter user_name 😥'
    );
  }
}
