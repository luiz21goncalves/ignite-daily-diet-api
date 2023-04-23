import { randomUUID } from 'node:crypto'

import { FastifyRequest, FastifyReply } from 'fastify'
import { StatusCodes } from 'http-status-codes'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'

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

  return replay.status(StatusCodes.CREATED).send({ user })
}
