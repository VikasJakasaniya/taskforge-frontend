<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <RouterView />
    <Toast />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import Toast from '@/components/common/Toast.vue'
</script>