import pino, { LoggerOptions } from 'pino'

import { isDev } from '@/constants'

const config: LoggerOptions = isDev
  ? {
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
        },
      },
    }
  : {}

export const logger = pino(config)
