import {Router} from 'express'
import callback from './handlers/callback'
import {
  subscribeNewFollow,
  processNewFollow,
} from './handlers/newFollow'
import {
  subscribeToStreamEvent,
  processStreamEvent,
  unsubscribeFromStreamEvent,
} from './handlers/streamEvent'

const router = Router()

router.get('/callback', callback)
router.get('/new_follow', subscribeNewFollow)
router.post('/new_follow', processNewFollow)
router.get('/stream_event', subscribeToStreamEvent)
router.post('/stream_event', processStreamEvent)
router.get('/stream_event_unsubscribe', subscribeToStreamEvent)
router.post('/stream_event_unsubscribe', unsubscribeFromStreamEvent)

export default router
