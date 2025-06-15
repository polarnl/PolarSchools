import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import chalk from 'chalk'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

serve({
  fetch: app.fetch,
  hostname: '0.0.0.0',
  port: 3000,
})

console.log(chalk.green('PolarSchools backend is aan op http://localhost:3000.'))

export default app