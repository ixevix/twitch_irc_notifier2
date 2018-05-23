import irc from 'irc'
// import logger from '../app/logger'
// import util from 'util'

export const ircbots: any[] = []

export const initIrcBot = (config: any) => {
  const {server, botname, channels, realName, route} = config
  const bot = new irc.Client(server, botname, {
    autoConnect: false,
    channels,
    realName,
  })
  bot.connect()
  ircbots.push({
    id: route,
    bot,
  })
}

export const sendToIrc = (id: string, username: string, title: string) => {
  ircbots.map((bot) => {
    if (bot.id === id) {
      // logger.info(util.inspect(bot.bot))
      bot.bot.opt.channels.map((channel: string) => {
        bot.bot.say(channel, `${username} went live "${title}" http://twitch.tv/${username.toLowerCase()}`)
      })
    }
  })
}
