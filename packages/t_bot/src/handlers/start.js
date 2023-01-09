import { fmt, bold } from 'telegraf/format';

export function start(ctx) {
  const name = ctx.update.message.from?.first_name
    ? `${ctx.update.message.from?.first_name} ${ctx.update.message.from?.last_name}`
    : ctx.update.message.from.username;
  const message = fmt`Howdy, ${bold`${name}`}!
Send me twitter user profiles to parse or use /help to get more instructions`;

  ctx.reply(message);
}
