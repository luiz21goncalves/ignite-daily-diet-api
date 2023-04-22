import fastify from 'fastify'

const app = fastify()

app
  .listen({ port: 3333, host: '0.0.0.0' })
  .then((url) => console.log(`HTTP Server Running! url:${url}`))
