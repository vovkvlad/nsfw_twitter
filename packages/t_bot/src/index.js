import process from 'node:process';
import path from 'node:path';
import { Telegraf } from 'telegraf';
import * as dotenv from 'dotenv';

import { help } from './handlers/help.js';
import { start } from './handlers/start.js';
import { twitter_profile_by_url } from './handlers/twitter_profile.js';

dotenv.config({ path: path.resolve('../../.env') });

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(start);
bot.help(help);
bot.url(/https?:\/\/twitter\.com\/(\w+)/, twitter_profile_by_url);
bot.hears(/\w*/, (ctx) => {});


bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
