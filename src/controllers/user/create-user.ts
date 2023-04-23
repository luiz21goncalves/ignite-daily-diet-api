import { randomUUID } from 'node:crypto'

import { FastifyRequest, FastifyReply } from 'fastify'
import { StatusCodes } from 'http-status-codes'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'

const THIRTY_DAYS_IN_MILLISECONDS = 1000 * 60 * 60 * 24 * 30

export async function createUser(
  request: FastifyRequest,
  replay: FastifyReply,
) {
  const createUserBodySchema = z.object({
    name: z.string().min(3),
  })

  const { name } = createUserBodySchema.parse(request.body)

  const user = await prisma.user.create({
    data: {
      id: randomUUID(),
      name,
    },
  })

  replay.cookie('sessionId', user.id, {
    path: '/',
    maxAge: THIRTY_DAYS_IN_MILLISECONDS,
  })

  return replay.status(StatusCodes.CREATED).send({ user })
}
