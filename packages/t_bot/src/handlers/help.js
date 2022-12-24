import { fmt, code } from 'telegraf/format';

export function help(ctx) {
  const message = fmt`Hey there!
To use this bot just send twitter profile links in the format of:
${code`https://twitter.com/<user_name>`} 
(Which can be achieved by just sharing twitter profile from the app)
Or optionally just send the nickname of the twitter profile in the form of: ${code`<user_name>`}`;
  ctx.reply(message);
}