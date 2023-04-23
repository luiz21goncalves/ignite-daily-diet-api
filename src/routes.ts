import { FastifyInstance } from 'fastify'

import { createUser } from './controllers/user/create-user'

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
}
