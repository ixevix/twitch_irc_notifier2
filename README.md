twitch_irc_notifier2
===================

An ircbot for notifying when followed streamers go live

- [TypeScript](https://www.typescriptlang.org/)
- ES6+, async/await, spread syntax, etc.
- [TSLint](https://palantir.github.io/tslint/)
- [Jest](https://facebook.github.io/jest/)
- [Winston](https://github.com/winstonjs/winston)
- irc
- axios
- js-sha256

Requirements: [Node 6+](https://nodejs.org/en/download/), [Yarn](https://yarnpkg.com/en/docs/install)
Twitch account for the bot. You need to be registered as a twitch developer and create an app in https://dev.twitch.tv
After creating the app fill in with your client_id and go to following url with the bots account and authorize your app for the bot

```
https://id.twitch.tv/oauth2/authorize?client_id=<client_id>&redirect_uri=<redirect_uri>&response_type=code&scope=user:edit
```

You will get the authorization code from twitch to the callback endpoint (shows in logs)

Generate a client secret in the app in the twitch dev portal
Then from the commandline on the server you can request your access/refresh tokens with curl

```
curl -X POST https://id.twitch.tv/oauth2/token?client_id=<client_id>&client_secret=<client_secret>&code=<authorization_code>&grant_type=authorization_code&redirect_uri=<redirect_uri>
```

Remember to set client_id, client_secret and refresh_token in the config.ts file


## Install

copy template files and edit them

```
yarn
cp .env.dev .env
cp config.ts.example config.ts
```

## Start dev server


```
yarn start
```

## Build for production

```
yarn build
```

This creates a build in `dist`.

## Run tests

```
./run-tests.sh
```

## License

[GPLv3](LICENSE.md)
