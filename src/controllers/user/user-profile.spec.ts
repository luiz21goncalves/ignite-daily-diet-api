import { StatusCodes } from 'http-status-codes'
import supertest from 'supertest'
import { expect, describe, beforeAll, afterAll, it } from 'vitest'

import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Create user', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to show a user profile', async () => {
    const { sessionId, user } = await createAndAuthenticateUser(app)

    const response = await supertest(app.server)
      .get('/me')
      .set('Cookie', [sessionId])

    expect(response.status).toEqual(StatusCodes.OK)
    expect(response.body).toStrictEqual({ user })
  })
})
