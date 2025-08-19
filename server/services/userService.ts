import type { User } from '#shared/models/User'

let users: User[] = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
]

export const userService = {
  getAll: (): User[] => users,

  create: (name: string): User => {
    const newUser = { id: users.length + 1, name }
    users.push(newUser)

    return newUser
  }
}