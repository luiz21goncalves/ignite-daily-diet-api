import { randomUUID } from 'node:crypto'

import { FastifyRequest, FastifyReply } from 'fastify'
import { StatusCodes } from 'http-status-codes'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'

export async function createMeal(
  request: FastifyRequest,
  replay: FastifyReply,
) {
  const createMealSchema = z.object({
    name: z.string().min(3),
    description: z.string(),
    date: z.coerce.date(),
    is_included_in_the_diet: z.boolean(),
  })
  const cookieSchema = z.object({
    sessionId: z.string().uuid(),
  })

  const { date, description, is_included_in_the_diet, name } =
    createMealSchema.parse(request.body)
  const { sessionId } = cookieSchema.parse(request.cookies)

  const meal = await prisma.meal.create({
    data: {
      id: randomUUID(),
      name,
      description,
      date,
      is_included_in_the_diet,
      user_id: sessionId,
    },
  })

  return replay.status(StatusCodes.CREATED).send({ meal })
}
