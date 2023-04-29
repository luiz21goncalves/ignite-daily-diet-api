import { FastifyReply, FastifyRequest } from 'fastify'
import { StatusCodes } from 'http-status-codes'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'

export async function deleteMeal(
  request: FastifyRequest,
  replay: FastifyReply,
) {
  const deleteMealParamsSchema = z.object({
    id: z.string().uuid(),
  })
  const cookieSchema = z.object({
    sessionId: z.string().uuid(),
  })

  const { id } = deleteMealParamsSchema.parse(request.params)
  const { sessionId } = cookieSchema.parse(request.cookies)

  const meal = await prisma.meal.findFirst({
    where: {
      id,
      user_id: sessionId,
    },
  })

  if (meal) {
    await prisma.meal.delete({ where: { id: meal.id } })

    return replay.status(StatusCodes.NO_CONTENT).send()
  }

  return replay.status(StatusCodes.UNAUTHORIZED).send()
}
