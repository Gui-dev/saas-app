import { app } from '@/http/server'
import { env } from '@saas/env'

const PORT = env.SERVER_PORT

app
  .listen({
    port: PORT,
  })
  .then(() => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
