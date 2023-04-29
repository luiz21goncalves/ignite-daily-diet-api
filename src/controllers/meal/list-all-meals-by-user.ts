import { FastifyRequest, FastifyReply } from 'fastify'
import { StatusCodes } from 'http-status-codes'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'

export async function listAllMealsByUser(
  request: FastifyRequest,
  replay: FastifyReply,
) {
  const cookieSchema = z.object({
    sessionId: z.string().uuid(),
  })
  const { sessionId } = cookieSchema.parse(request.cookies)

  const meals = await prisma.meal.findMany({
    where: {
      user_id: sessionId,
    },
  })

  return replay.status(StatusCodes.OK).send({ meals })
}
