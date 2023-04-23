import 'dotenv/config'

import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  PORT: z.coerce.number().default(3333),
  LOGGER_ENABLED: z.coerce.boolean(),
  LOGGER_LEVEL: z.enum([
    'trace',
    'debug',
    'info',
    'warn',
    'error',
    'fatal',
    'silent',
  ]),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('Invalid environment variables.', _env.error.format())

  throw new Error('Invalid environment variables.')
}

export const ENV = _env.data
