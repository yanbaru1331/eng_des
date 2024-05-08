import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

// app.get post putをおいて('urlパス, (c) => {処理の内容})
app.get('/hoge/huga', (c) => {
  return c.text('poyp~')
})
const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
