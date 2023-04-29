import { faker } from '@faker-js/faker'
import { StatusCodes } from 'http-status-codes'
import supertest from 'supertest'
import { expect, describe, beforeAll, afterAll, it } from 'vitest'

import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Delete Meal (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to delete a meal', async () => {
    const { sessionId } = await createAndAuthenticateUser(app)

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
      .delete(`/meals/${createMealResponse.body.meal.id}`)
      .set('Cookie', [sessionId])

    const meal = await prisma.meal.findFirst({
      where: { id: createMealResponse.body.meal.id },
    })

    expect(response.statusCode).toEqual(StatusCodes.NO_CONTENT)
    expect(meal).toBeNull()
  })
})
