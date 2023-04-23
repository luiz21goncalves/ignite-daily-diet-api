import { FastifyRequest, FastifyReply } from 'fastify'

import { prisma } from '@/lib/prisma'

export async function userProfile(
  request: FastifyRequest,
  replay: FastifyReply,
) {
  const sessionId = request.cookies.sessionId

  const user = await prisma.user.findUniqueOrThrow({ where: { id: sessionId } })

  return replay.send({ user })
}
