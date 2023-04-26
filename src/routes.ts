import { FastifyInstance } from 'fastify'

import { createMeal } from './controllers/meal/create-meal'
import { createUser } from './controllers/user/create-user'
import { userProfile } from './controllers/user/user-profile'
import { checkSessionIdExists } from './middleware/check-session-id-exists'

export async function appRoutes(app: FastifyInstance) {
  app.get('/healthcheck', (_request, replay) => {
    const healthcheck = {
      uptime: Number(process.uptime().toFixed(2)),
      message: 'running',
      timestamp: new Date(),
    }

    return replay.send({ healthcheck })
  })

  app.post('/users', createUser)
  app.get('/me', { preHandler: [checkSessionIdExists] }, userProfile)

  app.post('/meals', { preHandler: [checkSessionIdExists] }, createMeal)
}
