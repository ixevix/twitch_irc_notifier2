import {load as dotenv} from 'dotenv'
import createApp from './app/createApp'
import logger from './app/logger'
import {
  refreshTokens,
  getInitialFollows,
  subscribeToFollows,
  subscribeToStreams,
} from './api/agent'
import config from '../config'
import {initIrcBot} from './irc/bot'

dotenv()

const start = async () => {
  function refresh() {
    config.bots.map(async (bot) => {
      await refreshTokens(bot)
      await getInitialFollows(bot)
      await subscribeToFollows(bot)
      await subscribeToStreams(bot)
    })
    setTimeout(refresh, config.refreshTimeout * 1000)
  }
  try {
    const app = await createApp()
    const port = process.env.PORT || 3000

    app.listen(port, () => {
      logger.info(`App running on port ${port}...`)
    })

    config.bots.map((bot) => {
      initIrcBot(bot)
    })

    refresh()
  } catch (e) {
    logger.error(e.toString())

    process.exit(1)
  }
}

start()
