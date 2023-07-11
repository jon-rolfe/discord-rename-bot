# /rename your friends with Cloudflare Workers

A Discord bot to rename people based on a [slash-create template](https://github.com/Snazzah/slash-create-worker) by Snazzah, using [Cloudflare Workers](https://workers.cloudflare.com).

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/jon-rolfe/discord-rename-bot)

## Getting Started

### Cloning the repo

To get started, clone the repo:

```sh
git clone https://github.com/jon-rolfe/discord-rename-bot.git
cd discord-rename-bot
```

Then, install the required dependencies:

```sh
npm install
```

### Installing and setting up Wrangler

> Make sure to [sign up for a Cloudflare Workers account](https://dash.cloudflare.com/sign-up/workers) in a browser before continuing!

[Install Wrangler](https://developers.cloudflare.com/workers/cli-wrangler/install-update) if you haven't already:

```sh
npm install wrangler
```

Afterwards, login to your Cloudflare account:

```sh
wrangler login
```

Copy `wrangler.example.toml` into `wrangler.toml`. Make sure to fill in your account ID in the config and update the name of the worker. You can find your account ID [here](https://dash.cloudflare.com/?to=/:account/workers) or in the right-hand column of any domain in your account.

### Filling in secrets

You can enter in environment secrets with `wrangler secret put`. Here are the keys that are required to run this:

```sh
npx wrangler secret put DISCORD_APP_ID
npx wrangler secret put DISCORD_PUBLIC_KEY
npx wrangler secret put DISCORD_BOT_TOKEN
```

### Development

To run this locally, copy `.env.example` to `.dev.vars` and fill in the variables, then you can run `npm run dev` to start a local dev environment and [use something like Cloudflare Tunnels](https://developers.cloudflare.com/pages/how-to/preview-with-cloudflare-tunnel/) to tunnel it to a URL you can set as your `INTERACTIONS ENDPOINT URL` under your Discord bot settings.

To sync commands in the development environment, copy `.env.example` to `development.env` and fill in the variables, then run `npm run sync:dev`.

> Note: When you create a command, make sure to include it in the array of commands in `./src/commands/index.ts`.

### Production

> **This is a test script,** and it (deliberately) doesn't validate who is calling it and what permissions they have.

That means that anyone can rename anyone, and that is generally not desirable behavior in a public server. With that in mind, your bot _must_ be higher up on the permissions list than any renameable users. If you are a server owner, you can even put it above other administrators (allowing for everyone -- other than you -- to rename anyone else).

To sync to production, copy `.env.example` to `.env` and fill in the variables, then run `npm run sync`. To publish code to a worker, run `npm run deploy`.

Then, update your `INTERACTIONS ENDPOINT URL` in your Discord bot settings to the published address (route). To keep an eye on it or otherwise make sure it's working, try using `wrangler tail` to see live logs!
