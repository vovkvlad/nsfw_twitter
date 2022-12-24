import process from 'node:process';
import path from 'node:path';
import { Telegraf } from 'telegraf';
import * as dotenv from 'dotenv';

import { help } from './handlers/help.js';

dotenv.config({ path: path.resolve('../../.env') });

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) => ctx.reply('Welcome'));
bot.help((ctx) => help(ctx));
bot.hears('hi', (ctx) => ctx.reply('Hey there'));
bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
