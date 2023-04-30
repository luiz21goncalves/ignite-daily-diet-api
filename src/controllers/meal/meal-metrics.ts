import { FastifyRequest, FastifyReply } from 'fastify'
import { StatusCodes } from 'http-status-codes'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'

type SummaryAmountOfMealsRaw = {
  total: number
  on_the_diet: number
  off_the_diet: number
}

type CombinedMealsByTruncatedDateRaw = {
  formatted_date: Date
  diet: boolean[]
}

export async function mealMetrics(
  request: FastifyRequest,
  replay: FastifyReply,
) {
  const cookieSchema = z.object({
    sessionId: z.string().uuid(),
  })

  const { sessionId } = cookieSchema.parse(request.cookies)

  const [summaryAmountOfMeals] = await prisma.$queryRaw<
    SummaryAmountOfMealsRaw[]
  >`
    SELECT
      cast(count(*) as float) as total,
      (
        SELECT
          cast(count(*) as float)
        FROM meals
        WHERE user_id = ${sessionId}
        AND is_included_in_the_diet = true
      ) as on_the_diet,
      (
        SELECT
          cast(count(*) as float)
        FROM meals
        WHERE user_id = ${sessionId}
        AND is_included_in_the_diet = false
      ) as off_the_diet
    FROM meals
    WHERE user_id = ${sessionId}
  `

  const combinedMealsByTruncatedDateRaw = await prisma.$queryRaw<
    CombinedMealsByTruncatedDateRaw[]
  >`
    SELECT
      date_trunc('day', date) as formatted_date,
      ARRAY_AGG(is_included_in_the_diet ORDER BY date ASC) as diet
    FROM meals
    WHERE user_id = ${sessionId}
    GROUP BY formatted_date
    ORDER BY formatted_date ASC
  `

  const bestStreakByDay = combinedMealsByTruncatedDateRaw.reduce(
    (bestSequence, meal) => {
      let currentSequence = 0
      let maxSequence = 0

      meal.diet.forEach((inDiet) => {
        if (inDiet) {
          currentSequence++
        } else {
          currentSequence = 0
        }

        maxSequence = Math.max(maxSequence, currentSequence)
      })

      bestSequence = Math.max(maxSequence, bestSequence)

      return bestSequence
    },
    0,
  )

  return replay.status(StatusCodes.OK).send({
    meals: {
      ...summaryAmountOfMeals,
      best_streak_by_day: bestStreakByDay,
    },
  })
}
