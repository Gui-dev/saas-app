import { env } from '@saas/env'
import { app } from '@/http/server'

const PORT = env.PORT

app
  .listen({
    port: PORT,
    host: '0.0.0.0',
  })
  .then(() => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
