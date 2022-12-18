import process from 'node:process';
import { Client } from 'twitter-api-sdk';

export async function searchUserMedia(userName) {
  const client = new Client(process.env.BEARER_TOKEN);

  const response = await client.tweets.tweetsRecentSearch({
    query: `from:${userName} has:media -is:reply -is:retweet`,
    'tweet.fields': ['attachments', 'author_id', 'created_at', 'id', 'text'],
    expansions: ['attachments.media_keys'],
    'media.fields': ['preview_image_url', 'url'],
  });

  return response;
}
