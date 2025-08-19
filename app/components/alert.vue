<template>
  <Transition name="alert" :enter-active-class="animationClasses.enterActive"
    :enter-from-class="animationClasses.enterFrom" :enter-to-class="animationClasses.enterTo"
    :leave-active-class="animationClasses.leaveActive" :leave-from-class="animationClasses.leaveFrom"
    :leave-to-class="animationClasses.leaveTo">
    <div v-if="visible" :class="alertClasses" class="alert" role="alert" @mouseenter="pauseAutoClose"
      @mouseleave="resumeAutoClose">
      <!-- Ícone (opcional) -->
      <svg v-if="showIcon && iconPath" xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6"
        fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="iconPath" />
      </svg>

      <!-- Conteúdo do alert -->
      <div class="flex-1">
        <h3 v-if="title" class="font-bold">{{ title }}</h3>
        <div class="text-xs" v-if="message">{{ message }}</div>
        <!-- Slot para conteúdo customizado -->
        <slot v-else></slot>
      </div>

      <!-- Botão de fechar (opcional) -->
      <button v-if="closable" @click="closeAlert" class="btn btn-sm btn-circle btn-ghost ml-auto"
        aria-label="Fechar alert">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
interface Props {
  type?: 'info' | 'success' | 'warning' | 'error'
  title?: string
  message?: string
  closable?: boolean
  showIcon?: boolean
  autoClose?: boolean
  autoCloseDelay?: number
  modelValue?: boolean
  animationType?: 'slide' | 'fade' | 'scale' | 'bounce'
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  closable: true,
  showIcon: true,
  autoClose: false,
  autoCloseDelay: 5000,
  modelValue: true,
  animationType: 'slide'
})

const emit = defineEmits<Emits>()

// Controle de visibilidade
const visible = ref(props.modelValue)

// Watcher para sincronizar com v-model
watch(() => props.modelValue, (newValue) => {
  visible.value = newValue
})

watch(visible, (newValue) => {
  emit('update:modelValue', newValue)
})

// Classes de animação baseadas no tipo
const animationClasses = computed(() => {
  switch (props.animationType) {
    case 'fade':
      return {
        enterActive: 'transition-opacity duration-300 ease-out',
        enterFrom: 'opacity-0',
        enterTo: 'opacity-100',
        leaveActive: 'transition-opacity duration-200 ease-in',
        leaveFrom: 'opacity-100',
        leaveTo: 'opacity-0'
      }
    case 'scale':
      return {
        enterActive: 'transform transition-all duration-300 ease-out',
        enterFrom: 'opacity-0 scale-50',
        enterTo: 'opacity-100 scale-100',
        leaveActive: 'transform transition-all duration-200 ease-in',
        leaveFrom: 'opacity-100 scale-100',
        leaveTo: 'opacity-0 scale-50'
      }
    case 'bounce':
      return {
        enterActive: 'animate-bounce-in',
        enterFrom: 'opacity-0 scale-50 rotate-3',
        enterTo: 'opacity-100 scale-100 rotate-0',
        leaveActive: 'transition-all duration-200 ease-in',
        leaveFrom: 'opacity-100 scale-100',
        leaveTo: 'opacity-0 scale-95'
      }
    default: // slide
      return {
        enterActive: 'transform transition duration-300 ease-out',
        enterFrom: 'translate-y-2 opacity-0 scale-95',
        enterTo: 'translate-y-0 opacity-100 scale-100',
        leaveActive: 'transform transition duration-200 ease-in',
        leaveFrom: 'translate-y-0 opacity-100 scale-100',
        leaveTo: '-translate-y-2 opacity-0 scale-95'
      }
  }
})

// Classes do alert baseadas no tipo
const alertClasses = computed(() => {
  const baseClasses = ['alert']

  switch (props.type) {
    case 'success':
      return [...baseClasses, 'alert-success']
    case 'warning':
      return [...baseClasses, 'alert-warning']
    case 'error':
      return [...baseClasses, 'alert-error']
    default:
      return [...baseClasses, 'alert-info']
  }
})

// Ícones para cada tipo de alert
const iconPath = computed(() => {
  if (!props.showIcon) return null

  switch (props.type) {
    case 'success':
      return 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
    case 'warning':
      return 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
    case 'error':
      return 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
    default:
      return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  }
})

// Função para fechar o alert
const closeAlert = () => {
  visible.value = false
  emit('close')
}

// Auto close functionality
let autoCloseTimer: NodeJS.Timeout | null = null

onMounted(() => {
  if (props.autoClose && props.autoCloseDelay > 0) {
    autoCloseTimer = setTimeout(() => {
      closeAlert()
    }, props.autoCloseDelay)
  }
})

onUnmounted(() => {
  if (autoCloseTimer) {
    clearTimeout(autoCloseTimer)
  }
})

// Pausar auto close no hover (opcional)
const pauseAutoClose = () => {
  if (autoCloseTimer) {
    clearTimeout(autoCloseTimer)
    autoCloseTimer = null
  }
}

const resumeAutoClose = () => {
  if (props.autoClose && props.autoCloseDelay > 0 && !autoCloseTimer) {
    autoCloseTimer = setTimeout(() => {
      closeAlert()
    }, props.autoCloseDelay)
  }
}
</script>

<style scoped>
/* Estilos customizados se necessário */
.alert {
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
}

.alert:hover {
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
}

/* Animação bounce customizada */
@keyframes bounce-in {
  0% {
    opacity: 0;
    transform: scale(0.3) rotate(6deg);
  }

  50% {
    opacity: 1;
    transform: scale(1.05) rotate(-1deg);
  }

  70% {
    transform: scale(0.98) rotate(0.5deg);
  }

  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}

.animate-bounce-in {
  animation: bounce-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
</style>