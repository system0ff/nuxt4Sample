<template>
  <div>
    <p>Bem Vindo ao Nuxt + DaisyUI</p>
    <button class="btn w-64 rounded-full" @click="showAlert = true">Button</button>

    <!-- Alert com v-model -->
    <alert v-model="showAlert" type="error" title="Erro" message="Algo deu errado." @close="handleClose" />
  </div>
</template>

<script setup lang="ts">
const showAlert = ref(false)

const handleClose = () => {
  console.log("Alert Fechado!")
}
</script>