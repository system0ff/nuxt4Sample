import { userService } from '../../services/userService'
import { todoService } from '../../services/todoService'

export default defineEventHandler(async (event) => {
  const method = event.method

  if (method === 'GET') {
    const users = userService.getAll()
    return users.map(u => ({
      ...u,
      todos: todoService.getAll(u.id)
    })).toReversed()
  }

  if (method === 'POST') {
    const body = await readBody<{ name: string }>(event)
    return userService.create(body.name)
  }
})
