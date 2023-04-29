import { FastifyInstance } from 'fastify'

import { createMeal } from './controllers/meal/create-meal'
import { deleteMeal } from './controllers/meal/delete-meal'
import { getMeal } from './controllers/meal/get-meal'
import { listAllMealsByUser } from './controllers/meal/list-all-meals-by-user'
import { updateMeal } from './controllers/meal/update-meal'
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

  app.get('/meals', { preHandler: [checkSessionIdExists] }, listAllMealsByUser)
  app.get('/meals/:id', { preHandler: [checkSessionIdExists] }, getMeal)
  app.post('/meals', { preHandler: [checkSessionIdExists] }, createMeal)
  app.put('/meals/:id', { preHandler: [checkSessionIdExists] }, updateMeal)
  app.delete('/meals/:id', { preHandler: [checkSessionIdExists] }, deleteMeal)
}
