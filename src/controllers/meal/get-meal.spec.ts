import { randomUUID } from 'node:crypto'

import { faker } from '@faker-js/faker'
import { StatusCodes } from 'http-status-codes'
import supertest from 'supertest'
import { expect, describe, beforeAll, afterAll, it } from 'vitest'

import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Get Meal (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get a meal', async () => {
    const { sessionId, user } = await createAndAuthenticateUser(app)

    const { id, date, description, is_included_in_the_diet, name, user_id } =
      await prisma.meal.create({
        data: {
          id: randomUUID(),
          name: faker.lorem.words(),
          description: faker.lorem.paragraph(),
          date: faker.date.recent(),
          is_included_in_the_diet: faker.datatype.boolean(),
          user_id: user.id,
        },
      })

    const response = await supertest(app.server)
      .get(`/meals/${id}`)
      .set('Cookie', [sessionId])

    expect(response.statusCode).toEqual(StatusCodes.OK)
    expect(response.body).toStrictEqual({
      meal: {
        id,
        user_id,
        name,
        description,
        date: date.toISOString(),
        is_included_in_the_diet,
      },
    })
  })
})
