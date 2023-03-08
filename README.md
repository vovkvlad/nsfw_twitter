# NSFW Twitter

## Description
This is a pet project to mess around with twitter API. 
It parses twitter profile tweets that has images and feeds this images to a trained model to
classify whether the image has NSFW content or not. It then returns only photos that was classified as NSFW
by model with probability > threshold.

## Limitations
For now it only parses tweets for the last week. Unfortunately it's a limitation of twitter API 😔

## Structure

Basically the app consists of 2 services for now:

- API service
- Telegram Bot

### API
A fastify service which has 
- `/check` endpoint. Which receives a twitter username.
It then query twitter API for media tweets of that username and feeds each media file
to a pretrained model to classify whether the image has any NSFW content. It then returns only those media
files model classified as NSFW
- `/test` endpoint. Dummy endpoint to perform api service healthcheck

### Telegram bot
Responsible for parsing messages from the user, parsing them and making a respective calls to the API
For now await twitter profile URL e.g. `https://twitter.com/<user_name>`

## Run project locally
To run a project locally you'll have to obtain a twitter API token, and create a telegram bot.

- [How to get a twitter API token](https://developer.twitter.com/en/docs/twitter-api/getting-started/getting-access-to-the-twitter-api)
- [How to create telegram bot](https://t.me/BotFather)

Once you have both twitter API token and telegram bot clone this repository to your machine
and create `.env` file in the root of the project with next structure:

```dotenv
API_SERVER_PORT="<API_PORT>"
API_HOST=127.0.0.1
BEARER_TOKEN="<your twitter api token>"
API_KEY="Bearer ${BEARER_TOKEN}"

BOT_TOKEN="<you telegram bot token>"
```
Then run `docker compose up`. This should do a thing

### Local development
To start API service just run `npm run start:api`

To start Telegram bot just run `npm run start:bot`