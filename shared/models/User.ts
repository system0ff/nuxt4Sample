import type { Todo } from './Todo'
export interface User {
  id: number,
  name: string,
  todos?: Todo[]
}