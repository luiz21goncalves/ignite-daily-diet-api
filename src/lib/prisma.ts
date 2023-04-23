import { PrismaClient } from '@prisma/client'

import { isDev } from '@/constants'

const prisma = new PrismaClient({ log: isDev ? ['query'] : [] })

export { prisma }
