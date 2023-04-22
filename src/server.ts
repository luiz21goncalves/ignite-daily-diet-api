import fastify from 'fastify'

import { ENV } from './env'

const app = fastify()

app
  .listen({ port: ENV.PORT, host: '0.0.0.0' })
  .then((url) => console.log(`HTTP Server Running! url:${url}`))
