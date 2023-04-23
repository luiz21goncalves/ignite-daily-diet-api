import { faker } from '@faker-js/faker'
import { StatusCodes } from 'http-status-codes'
import supertest from 'supertest'
import { expect, describe, beforeAll, afterAll, it } from 'vitest'

import { app } from '@/app'

describe('Create user', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a user', async () => {
    const name = faker.name.fullName()

    const response = await supertest(app.server).post('/users').send({
      name,
    })

    expect(response.statusCode).toEqual(StatusCodes.CREATED)
    expect(response.body).toStrictEqual({
      user: {
        id: expect.any(String),
        name,
        created_at: expect.any(String),
      },
    })
  })
})