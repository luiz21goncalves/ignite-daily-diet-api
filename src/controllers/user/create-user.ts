import { randomUUID } from 'node:crypto'

import { FastifyRequest, FastifyReply } from 'fastify'
import { StatusCodes } from 'http-status-codes'
import { z } from 'zod'

export async function createUser(
  request: FastifyRequest,
  replay: FastifyReply,
) {
  const createUserBodySchema = z.object({
    name: z.string().min(3),
  })

  const { name } = createUserBodySchema.parse(request.body)

  const user = { id: randomUUID(), name, created_at: new Date() }

  return replay.status(StatusCodes.CREATED).send({ user })
}
