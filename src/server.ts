import fastify from 'fastify'
import { ZodError } from 'zod'

import { ENV } from './env'
import { logger } from './logger'
import { appRoutes } from './routes'

const app = fastify({
  logger,
})

app.register(appRoutes)

app.setErrorHandler((error, request, replay) => {
  if (error instanceof ZodError) {
    logger.error({
      url: request.url,
      body: request.body,
      message: 'Validation error.',
      issues: error.format(),
    })

    return replay.status(400).send({
      message: 'Validation error.',
      issues: error.format(),
    })
  }

  logger.error({ error, url: request.url })

  return replay.status(500).send({ message: 'Internal server error' })
})

app.listen({ port: ENV.PORT, host: '0.0.0.0' })
