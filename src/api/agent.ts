import axios from 'axios'
import logger from '../app/logger'
import util from 'util'
import globalConfig from '../../config'
import {sleep} from '../util'

export const refreshTokens = async (config: any) => {
  const {
    tokenUrl,
    refresh_token,
    client_id,
    client_secret,
  } = config
  try {
    const refreshResponse = await axios({
      method: 'POST',
      url: `${tokenUrl}` +
        '?grant_type=refresh_token' +
        `&refresh_token=${refresh_token}` +
        `&client_id=${client_id}` +
        `&client_secret=${client_secret}`,
    })
    logger.info(util.inspect(refreshResponse.data))
    config.access_token = refreshResponse.data.access_token
  } catch(err) {
    logger.error(err)
  }
}

export const getInitialFollows = async (config: any) => {
  const {client_id, userId, apiUrl} = config
  try {
    const followsResponse = await axios({
      method: 'GET',
      url: `${apiUrl}/users/follows?from_id=${userId}&first=100`,
      headers: {
        'Client-ID': client_id,
      },
    })
    logger.info(util.inspect(followsResponse.data.total))
    config.initialFollows = followsResponse.data
  } catch(err) {
    logger.error(err)
  }
}

export const getUserName = async (config: any, userId: string) => {
  const {client_id, apiUrl} = config
  try {
    const usernameResponse = await axios({
      method: 'GET',
      url: `${apiUrl}/users?id=${userId}`,
      headers: {
        'Client-ID': client_id,
      },
    })
    logger.info(util.inspect(usernameResponse.data))
    return usernameResponse.data.data[0].display_name
  } catch(err) {
    logger.error(err)
  }
}

const subscribe = async (config: any, callback: string, topic: string, mode: string) => {
  const {apiUrl, client_id, timeout} = config
  const secret = globalConfig.subscriptionSecret
  const payload = {
    'hub.callback': callback,
    'hub.mode': mode,
    'hub.topic': `${apiUrl}${topic}`,
    'hub.lease_seconds': timeout,
    'hub.secret': secret,
  }
  const requestUrl = `${apiUrl}/webhooks/hub`
  logger.info(util.inspect(payload))
  logger.info(requestUrl)
  try {
    const subscriptionResponse = await axios({
      method: 'POST',
      url: requestUrl,
      data: payload,
      headers: {
        'Client-ID': client_id,
        'Content-Type': 'application/json',
      },
    })
    logger.info(util.inspect(subscriptionResponse.data))
  } catch(err) {
    logger.error(err)
  }
}

export const subscribeToFollows = async (config: any) => {
  const {callbackUrl, userId} = config
  const topic = `/users/follows?first=1&from_id=${userId}`
  const callback = `${callbackUrl}/new_follow`
  await subscribe(config, callback, topic, 'subscribe')
}

export const subscribeToStream = async (config: any, userId: string) => {
  const {callbackUrl} = config
  const topic = `/streams?user_id=${userId}`
  const callback = `${callbackUrl}/stream_event`
  await subscribe(config, callback, topic, 'subscribe')
}

export const unsubscribeFromStream = async (config: any, userId: string) => {
  const {callbackUrl} = config
  const topic = `/streams?user_id=${userId}`
  const callback = `${callbackUrl}/stream_event_unsubscribe`
  await subscribe(config, callback, topic, 'unsubscribe')
}

export const subscribeToStreams = async (config: any) => {
  // for (let i = 0; i < config.initialFollows.data.length; i++) {
  for (const data of config.initialFollows.data) {
    await subscribeToStream(config, data.to_id)
    await sleep(2500)
  }
}
