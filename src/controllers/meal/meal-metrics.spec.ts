import { randomUUID } from 'node:crypto'

import { faker } from '@faker-js/faker'
import dayjs from 'dayjs'
import { StatusCodes } from 'http-status-codes'
import supertest from 'supertest'
import { expect, describe, beforeAll, afterAll, it } from 'vitest'

import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Meal Metrics (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get user meal metrics', async () => {
    const { sessionId, user } = await createAndAuthenticateUser(app)

    const firstDate = dayjs(faker.date.recent()).startOf('day')
    const secondDate = firstDate.add(5, 'days')
    const thirdDate = secondDate.add(5, 'days')

    await Promise.all([
      prisma.meal.create({
        data: {
          id: randomUUID(),
          name: faker.lorem.words(),
          description: faker.lorem.paragraph(),
          date: firstDate.add(6, 'hour').toDate(),
          is_included_in_the_diet: true,
          user_id: user.id,
        },
      }),
      prisma.meal.create({
        data: {
          id: randomUUID(),
          name: faker.lorem.words(),
          description: faker.lorem.paragraph(),
          date: firstDate.add(9, 'hour').toDate(),
          is_included_in_the_diet: false,
          user_id: user.id,
        },
      }),
      prisma.meal.create({
        data: {
          id: randomUUID(),
          name: faker.lorem.words(),
          description: faker.lorem.paragraph(),
          date: firstDate.add(12, 'hour').toDate(),
          is_included_in_the_diet: true,
          user_id: user.id,
        },
      }),
      prisma.meal.create({
        data: {
          id: randomUUID(),
          name: faker.lorem.words(),
          description: faker.lorem.paragraph(),
          date: firstDate.add(15, 'hour').toDate(),
          is_included_in_the_diet: true,
          user_id: user.id,
        },
      }),
      prisma.meal.create({
        data: {
          id: randomUUID(),
          name: faker.lorem.words(),
          description: faker.lorem.paragraph(),
          date: firstDate.add(18, 'hour').toDate(),
          is_included_in_the_diet: true,
          user_id: user.id,
        },
      }),
      prisma.meal.create({
        data: {
          id: randomUUID(),
          name: faker.lorem.words(),
          description: faker.lorem.paragraph(),
          date: secondDate.add(6, 'hour').toDate(),
          is_included_in_the_diet: true,
          user_id: user.id,
        },
      }),
      prisma.meal.create({
        data: {
          id: randomUUID(),
          name: faker.lorem.words(),
          description: faker.lorem.paragraph(),
          date: secondDate.add(9, 'hour').toDate(),
          is_included_in_the_diet: true,
          user_id: user.id,
        },
      }),
      prisma.meal.create({
        data: {
          id: randomUUID(),
          name: faker.lorem.words(),
          description: faker.lorem.paragraph(),
          date: secondDate.add(12, 'hour').toDate(),
          is_included_in_the_diet: false,
          user_id: user.id,
        },
      }),
      prisma.meal.create({
        data: {
          id: randomUUID(),
          name: faker.lorem.words(),
          description: faker.lorem.paragraph(),
          date: thirdDate.add(9, 'hour').toDate(),
          is_included_in_the_diet: true,
          user_id: user.id,
        },
      }),
      prisma.meal.create({
        data: {
          id: randomUUID(),
          name: faker.lorem.words(),
          description: faker.lorem.paragraph(),
          date: thirdDate.add(12, 'hour').toDate(),
          is_included_in_the_diet: true,
          user_id: user.id,
        },
      }),
    ])

    const response = await supertest(app.server)
      .get('/meals/metrics')
      .set('Cookie', [sessionId])

    expect(response.statusCode).toEqual(StatusCodes.OK)
    expect(response.body).toStrictEqual({
      meals: {
        total: 10,
        on_the_diet: 8,
        off_the_diet: 2,
        best_streak_by_day: 3,
      },
    })
  })
})
