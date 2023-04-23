import { app } from './app'
import { ENV } from './env'

app.listen({ port: ENV.PORT, host: '0.0.0.0' })
