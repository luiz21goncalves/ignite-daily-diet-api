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

  const { id } = deleteMealParamsSchema.parse(request.params)

  await prisma.meal.delete({ where: { id } })

  return replay.status(StatusCodes.NO_CONTENT).send()
}
