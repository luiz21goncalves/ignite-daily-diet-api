import { FastifyRequest, FastifyReply } from 'fastify'
import { StatusCodes } from 'http-status-codes'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'

export async function getMeal(request: FastifyRequest, replay: FastifyReply) {
  const updateMealParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const cookieSchema = z.object({
    sessionId: z.string().uuid(),
  })

  const { sessionId } = cookieSchema.parse(request.cookies)
  const { id } = updateMealParamsSchema.parse(request.params)

  const meal = await prisma.meal.findFirst({
    where: {
      id,
      user_id: sessionId,
    },
  })

  return replay.status(StatusCodes.OK).send({ meal })
}
