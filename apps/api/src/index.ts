import { app } from '@/http/server'

const PORT = 3333

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
