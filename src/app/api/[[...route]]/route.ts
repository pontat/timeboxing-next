import { Hono } from 'hono'
import { handle } from 'hono/vercel'

export const runtime = 'edge'

const app = new Hono().basePath('/api')

const route = app
  .get('/hello', (c) => {
    return c.json({ message: 'Hello Next.js!' })
  })
  .get('/timeboxes', (c) => {
    return c.json({ message: 'GET request received' })
  })

export type AppType = typeof route

export const GET = handle(app)
export const POST = handle(app)
