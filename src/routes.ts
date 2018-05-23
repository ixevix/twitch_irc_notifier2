import {Router} from 'express'
import config from '../config'
import botRouter from './modules/routes'
// import logger from './app/logger'

const router = Router()

config.bots.map((bot) => {
  // logger.info(bot.route)
  router.use(`/${bot.route}`, botRouter)
})

router.all('*', (req, res) => res.sendStatus(404))

export default router
