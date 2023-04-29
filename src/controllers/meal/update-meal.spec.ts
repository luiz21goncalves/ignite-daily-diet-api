import { faker } from '@faker-js/faker'
import dayjs from 'dayjs'
import { StatusCodes } from 'http-status-codes'
import supertest from 'supertest'
import { expect, describe, beforeAll, afterAll, it } from 'vitest'

import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Update Meal (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to update a meal', async () => {
    const { sessionId, user } = await createAndAuthenticateUser(app)

    const createMealResponse = await supertest(app.server)
      .post('/meals')
      .set('Cookie', [sessionId])
      .send({
        name: faker.lorem.words(),
        description: faker.lorem.paragraph(),
        date: faker.date.recent(),
        is_included_in_the_diet: true,
      })

    const response = await supertest(app.server)
      .put(`/meals/${createMealResponse.body.meal.id}`)
      .set('Cookie', [sessionId])
      .send({
        name: 'Dogão',
        description: 'Pão, salsicha, e varias outras coisas',
        date: dayjs('2023-04-29T16:00:00.000Z'),
        is_included_in_the_diet: false,
      })

    expect(response.statusCode).toEqual(StatusCodes.OK)
    expect(response.body).toStrictEqual({
      meal: {
        id: expect.any(String),
        user_id: user.id,
        name: 'Dogão',
        description: 'Pão, salsicha, e varias outras coisas',
        date: dayjs('2023-04-29T16:00:00.000Z').toISOString(),
        is_included_in_the_diet: false,
      },
    })
  })
})
