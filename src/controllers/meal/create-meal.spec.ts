import { faker } from '@faker-js/faker'
import { StatusCodes } from 'http-status-codes'
import supertest from 'supertest'
import { expect, describe, beforeAll, afterAll, it } from 'vitest'

import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Create Meal (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a meal', async () => {
    const { sessionId, user } = await createAndAuthenticateUser(app)

    const name = faker.lorem.words()
    const description = faker.lorem.paragraph()
    const date = faker.date.recent()
    const is_included_in_the_diet = faker.datatype.boolean()

    const response = await supertest(app.server)
      .post('/meals')
      .set('Cookie', [sessionId])
      .send({
        name,
        description,
        date,
        is_included_in_the_diet,
      })

    expect(response.statusCode).toEqual(StatusCodes.CREATED)
    expect(response.body).toStrictEqual({
      meal: {
        id: expect.any(String),
        user_id: user.id,
        name,
        description,
        date: date.toISOString(),
        is_included_in_the_diet,
      },
    })
  })
})
