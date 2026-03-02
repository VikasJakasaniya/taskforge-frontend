<template>
  <div class="flex items-center justify-center" :class="sizeClass">
    <div class="animate-spin rounded-full border-b-2" :class="[borderClass, sizeClass]"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  color: {
    type: String,
    default: 'primary'
  }
})

const sizeClass = computed(() => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }
  return sizes[props.size]
})

const borderClass = computed(() => {
  const colors = {
    primary: 'border-primary-600',
    white: 'border-white',
    gray: 'border-gray-600'
  }
  return colors[props.color] || colors.primary
})
</script>