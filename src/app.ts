import fastify from 'fastify'
import { StatusCodes } from 'http-status-codes'
import { ZodError } from 'zod'

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

    return replay.status(StatusCodes.BAD_REQUEST).send({
      message: 'Validation error.',
      issues: error.format(),
    })
  }

  logger.error({ error, url: request.url })

  return replay
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .send({ message: 'Internal server error' })
})

export { app }
