import { FastifyRequest, FastifyReply } from 'fastify'
import { StatusCodes } from 'http-status-codes'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'

export async function updateMeal(
  request: FastifyRequest,
  replay: FastifyReply,
) {
  const updateMealSchema = z.object({
    name: z.string().min(3),
    description: z.string(),
    date: z.coerce.date(),
    is_included_in_the_diet: z.boolean(),
  })

  const updateMealParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const { date, description, is_included_in_the_diet, name } =
    updateMealSchema.parse(request.body)
  const { id } = updateMealParamsSchema.parse(request.params)

  const meal = await prisma.meal.update({
    where: { id },
    data: {
      name,
      description,
      date,
      is_included_in_the_diet,
    },
  })

  return replay.status(StatusCodes.OK).send({ meal })
}
