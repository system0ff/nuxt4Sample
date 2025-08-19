import type { Todo } from '#shared/models/Todo'

let todos: Todo[] = [
  { id: 1, userId: 1, title: 'Comprar pão', done: false },
  { id: 2, userId: 2, title: 'Estudar Nuxt', done: true },
  { id: 3, userId: 2, title: 'Fazer Exercicios', done: false }
]

export const todoService = {
  getAll: (userId?: number): Todo[] => {
    return userId ? todos.filter(t => t.userId === userId): todos
  }, 

  create: (userId: number, title: string): Todo => {
    const newTodo = { id: todos.length + 1, userId, title, done: false }
    todos.push(newTodo)
    
    return newTodo
  },

  toggle: (id: number): Todo | null => {
    const todo = todos.find(t => t.id === id)
    if(!todo) return null

    todo.done = !todo.done

    return todo
  },

  remove: (id: number): boolean => {
    const idx = todos.findIndex(t => t.id === id)
    if (idx === -1) return false
    
    todos.splice(idx, 1)
    return true
  }
}