# AdminPanel (WIP)

Tool for Discord admins and moderators to keep track of bans, warning, and other stuff about members. Not at all usable yet, barely anything is implemented.

## Setup

Install Node.js and PostgreSQL (CockroachDB should also work, but I haven't tested). Clone the repo.
Create your Postgres database ([detailed instructions can be found in my VoteBox repo](https://github.com/KHTangent/votebox)). Create a new OAuth2 application on the Discord developer portal, and retrieve the client ID and secret. Add your hostname with `/authcallback` as an allowed redirect URI, such as `http://localhost:3000/authcallback`.

Create a .env file in the project root, and fill out the following fields:

```bash
NUXT_DISCORD_CLIENT_ID=clientid
NUXT_DISCORD_CLIENT_SECRET=clientsecret
NUXT_DISCORD_REDIRECT_URI="http://localhost:3000/authcallback"
PGUSER=postgresusername
PGPASSWORD=postgrespassword
PGHOST=localhost
PGDATABASE=adminpanel
```

Run database migrations with `npm run migrate up`. Start the adminpanel with `npm run start`
