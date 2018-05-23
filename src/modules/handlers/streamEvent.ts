import {Request, Response} from 'express'
import {sha256} from 'js-sha256'
import logger from '../../app/logger'
import util from 'util'
import config from '../../../config'
import {getUserName, unsubscribeFromStream} from '../../api/agent'
import {sendToIrc} from '../../irc/bot'

export const subscribeToStreamEvent = (req: Request, res: Response) => {
  logger.info(util.inspect(req.query))
  if(req.query && req.query['hub.challenge']) {
    res.send(req.query['hub.challenge'])
  } else {
    res.sendStatus(200)
  }
}

export const unsubscribeFromStreamEvent = (req: Request, res: Response) => {
  // logger.info(util.inspect(req))
  if(req.headers['x-api-key']) {
    if(req.headers['x-api-key'] === config.subscriptionSecret) {
      if(req.query.user_id) {
        res.sendStatus(200)
        const userId = req.query.user_id
        const id = req.baseUrl.substring(1)
        const botConfig = config.bots.filter((bot) => {
          return bot.route === id
        })
        unsubscribeFromStream(botConfig[0], userId)
      }
    } else {
      res.sendStatus(401)
    }
  } else {
    res.sendStatus(200)
  }
}

export const processStreamEvent = (req: Request, res: Response) => {
  logger.info(util.inspect(req.body.data))
  if (req.headers['x-hub-signature']) {
    const xhubSignature = req.headers['x-hub-signature'].toString()
    const checksum = `sha256=${sha256.hmac(config.subscriptionSecret, JSON.stringify(req.body))}`
    if (xhubSignature === checksum) {
      res.sendStatus(200)
      req.body.data.map(async (data: any) => {
        const id = req.baseUrl.substring(1)
        const botConfig = config.bots.filter((bot) => {
          return bot.route === id
        })
        const userId = data.user_id
        const title = data.title
        const username = await getUserName(botConfig[0], userId)
        sendToIrc(id, username, title)
      })
    } else {
      res.sendStatus(401)
    }
  } else {
    res.sendStatus(200)
  }
}
