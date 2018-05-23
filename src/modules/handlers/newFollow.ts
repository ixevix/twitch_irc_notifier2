import {Request, Response} from 'express'
import {sha256} from 'js-sha256'
// import logger from '../../../app/logger'
// import util from 'util'
import config from '../../../config'
import {subscribeToStream} from '../../api/agent'

export const subscribeNewFollow = (req: Request, res: Response) => {
  // logger.info(util.inspect(req))
  if(req.query && req.query['hub.challenge']) {
    res.send(req.query['hub.challenge'])
  } else {
    res.sendStatus(200)
  }
}

export const processNewFollow = (req: Request, res: Response) => {
  // logger.info(util.inspect(req.headers))
  if (req.headers['x-hub-signature']) {
    const xhubSignature = req.headers['x-hub-signature'].toString()
    // logger.info(config.subscriptionSecret)
    const checksum = `sha256=${sha256.hmac(config.subscriptionSecret, JSON.stringify(req.body))}`
    // logger.info(xhubSignature)
    // logger.info(checksum)
    if (xhubSignature === checksum) {
      res.sendStatus(200)
      const id = req.baseUrl.substring(1)
      const botConfig = config.bots.filter((bot) => {
        return bot.route === id
      })
      // logger.info(util.inspect(botConfig))
      // logger.info(util.inspect(req.body))
      req.body.data.map((data: any) => {
        const userId = data.to_id
        subscribeToStream(botConfig[0], userId)
      })
    } else {
      res.sendStatus(401)
    }
  } else {
    res.sendStatus(200)
  }
}
