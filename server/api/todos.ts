import { todoService } from '../services/todoService'

export default defineEventHandler(async (event) => {
  const method = event.method

  if (method === 'GET') {
    const query = getQuery(event)
    const userId = query.userId ? Number(query.userId) : undefined
    return todoService.getAll(userId)
  }

  if (method === 'POST') {
    const body = await readBody<{ userId: number; title: string }>(event)
    return todoService.create(body.userId, body.title)
  }

  if (method === 'PUT') {
    const body = await readBody<{ id: number }>(event)
    return todoService.toggle(body.id)
  }

  if (method === 'DELETE') {
    const query = getQuery(event)
    return todoService.remove(Number(query.id))
  }
})
