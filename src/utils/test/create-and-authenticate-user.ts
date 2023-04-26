import { faker } from '@faker-js/faker'
import { User } from '@prisma/client'
import { FastifyInstance } from 'fastify'
import supertest from 'supertest'

export async function createAndAuthenticateUser(app: FastifyInstance) {
  const name = faker.name.fullName()

  const response = await supertest(app.server).post('/users').send({
    name,
  })

  const user = response.body.user as User
  const sessionId = response.headers['set-cookie'][0] as string

  return { user, sessionId }
}
