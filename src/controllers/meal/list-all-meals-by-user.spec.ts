import { randomUUID } from 'node:crypto'

import { faker } from '@faker-js/faker'
import { StatusCodes } from 'http-status-codes'
import supertest from 'supertest'
import { expect, describe, beforeAll, afterAll, it } from 'vitest'

import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('List all meals by user (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to list all user meals', async () => {
    const { sessionId, user } = await createAndAuthenticateUser(app)

    await Promise.all([
      prisma.meal.create({
        data: {
          id: randomUUID(),
          name: faker.lorem.words(),
          description: faker.lorem.paragraph(),
          date: faker.date.recent(),
          is_included_in_the_diet: faker.datatype.boolean(),
          user_id: user.id,
        },
      }),
      prisma.meal.create({
        data: {
          id: randomUUID(),
          name: faker.lorem.words(),
          description: faker.lorem.paragraph(),
          date: faker.date.recent(),
          is_included_in_the_diet: faker.datatype.boolean(),
          user_id: user.id,
        },
      }),
      prisma.meal.create({
        data: {
          id: randomUUID(),
          name: faker.lorem.words(),
          description: faker.lorem.paragraph(),
          date: faker.date.recent(),
          is_included_in_the_diet: faker.datatype.boolean(),
          user_id: user.id,
        },
      }),
      prisma.meal.create({
        data: {
          id: randomUUID(),
          name: faker.lorem.words(),
          description: faker.lorem.paragraph(),
          date: faker.date.recent(),
          is_included_in_the_diet: faker.datatype.boolean(),
          user_id: user.id,
        },
      }),
      prisma.meal.create({
        data: {
          id: randomUUID(),
          name: faker.lorem.words(),
          description: faker.lorem.paragraph(),
          date: faker.date.recent(),
          is_included_in_the_diet: faker.datatype.boolean(),
          user: {
            create: {
              id: randomUUID(),
              name: faker.name.fullName(),
            },
          },
        },
      }),
    ])

    const response = await supertest(app.server)
      .get('/meals')
      .set('Cookie', [sessionId])

    expect(response.statusCode).toEqual(StatusCodes.OK)
    expect(response.body.meals).toHaveLength(4)
  })
})
