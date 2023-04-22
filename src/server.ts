import fastify from 'fastify'

import { ENV } from './env'
import { appRoutes } from './routes'

const app = fastify()

app.register(appRoutes)

app
  .listen({ port: ENV.PORT, host: '0.0.0.0' })
  .then((url) => console.log(`HTTP Server Running! url:${url}`))
