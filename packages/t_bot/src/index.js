import process from 'node:process';
import path from 'node:path';
import { Telegraf } from 'telegraf';
import * as dotenv from 'dotenv';

import { logger } from './logger.js';
import { help } from './handlers/help.js';
import { start } from './handlers/start.js';
import { twitter_profile_by_url } from './handlers/twitter_profile.js';

if (process.env.NODE_ENV === 'development') {
  dotenv.config({ path: path.resolve('../../.env') });
}
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use(async (ctx, next) => {
  logger.info(
    `Received message: ${ctx.message.text}. User: ${ctx.update.message.from.username}. isBot: ${ctx.update.message.from.is_bot}`
  );
  await next();
});

bot.start(start);
bot.help(help);
bot.url(/https?:\/\/twitter\.com\/(\w+)/, twitter_profile_by_url);
bot.hears(/\w*/, (ctx) => {});

logger.info('Starting bot');
bot.launch();
logger.info('Bot has been successfully started');

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
