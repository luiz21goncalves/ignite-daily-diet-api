import fastify from 'fastify'
import { ZodError } from 'zod'

import { ENV } from './env'
import { appRoutes } from './routes'

const app = fastify()

app.register(appRoutes)

app.setErrorHandler((error, _request, replay) => {
  console.log(error)

  if (error instanceof ZodError) {
    return replay
      .status(400)
      .send({ message: 'Validation error.', issues: error.format() })
  }

  return replay.status(500).send({ message: 'Internal server error' })
})

app
  .listen({ port: ENV.PORT, host: '0.0.0.0' })
  .then((url) => console.log(`HTTP Server Running! url:${url}`))
