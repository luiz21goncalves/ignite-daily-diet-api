import pino, { LoggerOptions } from 'pino'

import { isDev } from '@/constants'
import { ENV } from '@/env'

const config: LoggerOptions = {
  level: ENV.LOGGER_LEVEL,
  enabled: ENV.LOGGER_ENABLED,
}

if (isDev) {
  config.transport = {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  }
}

export const logger = pino(config)
