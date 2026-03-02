<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center gap-8">
            <h1 class="text-xl font-bold text-primary-600">TaskForge</h1>
            
            <div class="hidden md:flex gap-4">
              <router-link
                to="/tasks"
                class="px-3 py-2 rounded-md text-sm font-medium transition-colors"
                :class="isActive('/tasks') ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'"
              >
                Tasks
              </router-link>
              <router-link
                to="/imports"
                class="px-3 py-2 rounded-md text-sm font-medium transition-colors"
                :class="isActive('/imports') ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'"
              >
                Imports
              </router-link>
            </div>
          </div>
          
          <div class="flex items-center gap-4">
            <div class="hidden md:block text-sm text-gray-600">
              {{ authStore.user?.email }}
            </div>
            <button
              @click="handleLogout"
              class="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
    
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <slot></slot>
    </main>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAuth } from '@/composables/useAuth'

const route = useRoute()
const authStore = useAuthStore()
const { logout } = useAuth()

const isActive = (path) => {
  return route.path.startsWith(path)
}

const handleLogout = async () => {
  if (confirm('Are you sure you want to logout?')) {
    await logout()
  }
}
</script>