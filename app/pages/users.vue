<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-6">👥 Usuários & Todos</h1>

    <!-- Card para adicionar usuário -->
    <div class="card bg-base-100 shadow-md mt-6">
      <div class="card-body">
        <h2 class="card-title">Adicionar Usuário</h2>
        <div class="join">
          <input v-model="newUser" placeholder="Nome do usuário" class="input input-bordered join-item w-full" />
          <button @click="addUser" class="btn btn-primary join-item">
            Adicionar
          </button>
        </div>
      </div>
    </div>

    <!-- Card de Usuários -->
    <div v-for="u in users" :key="u.id" class="card bg-base-200 shadow-md mb-6">
      <div class="card-body">
        <h2 class="card-title">{{ u.name }}</h2>

        <!-- Lista de Todos -->
        <ul class="space-y-2">
          <li v-for="t in u.todos" :key="t.id" class="flex items-center gap-2">
            <input type="checkbox" class="checkbox checkbox-sm" :checked="t.done" @change="toggleTodo(t.id)" />
            <span :class="{ 'line-through text-gray-400': t.done }" class="flex-1">
              {{ t.title }}
            </span>
            <button class="btn btn-xs btn-error" @click="removeTodo(t.id)">
              ✕
            </button>
          </li>
        </ul>

        <!-- Form novo Todo -->
        <div class="join mt-3">
          <input v-model="newTodos[u.id]" placeholder="Novo todo" class="input input-bordered join-item w-full" />
          <button @click="addTodo(u.id)" class="btn btn-success join-item">
            +
          </button>
        </div>
      </div>
    </div>


  </div>
</template>

<script setup lang="ts">
import type { User } from '#shared/models/User'

const { data: users, refresh } = useFetch<User[]>('/api/users')

const newUser = ref('')
const newTodos = reactive<Record<number, string>>({})

// Criar usuário
const addUser = async () => {
  if (!newUser.value.trim()) return

  await $fetch('/api/users', {
    method: 'POST',
    body: { name: newUser.value }
  })

  newUser.value = ''
  refresh()
}

// Criar todo
const addTodo = async (userId: number) => {
  const title = newTodos[userId]?.trim()
  if (!title) return

  await $fetch('/api/todos', {
    method: 'POST',
    body: { userId, title }
  })

  newTodos[userId] = ''
  refresh()
}

// Alternar todo
const toggleTodo = async (id: number) => {
  await $fetch('/api/todos', {
    method: 'PUT',
    body: { id }
  })

  refresh()
}

// Remover todo
const removeTodo = async (id: number) => {
  await $fetch('/api/todos', {
    method: 'DELETE',
    query: { id }
  })

  refresh()
}
</script>
