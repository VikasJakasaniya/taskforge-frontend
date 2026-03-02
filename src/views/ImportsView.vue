<template>
  <MainLayout>
    <div class="space-y-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Imports</h1>
        <p class="mt-1 text-gray-600">Bulk import tasks from CSV files</p>
        
        <!-- WebSocket connection status -->
        <div v-if="connectionError" class="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-800">
          ❌ Connection error: {{ connectionError }}
          <button @click="reconnectWebSocket" class="underline ml-2">Retry</button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-1">
          <ImportUpload />
        </div>
        
        <div class="lg:col-span-2">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900">Import History</h2>
            <button
              @click="refreshImports"
              class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Refresh"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
          
          <ImportList
            :imports="importsStore.imports"
            :loading="importsStore.loading"
            @delete="handleDelete"
          />
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useImportsStore } from '@/stores/imports'
import { useAuthStore } from '@/stores/auth'
import { useWebSocket } from '@/composables/useWebSocket'
import { useToast } from '@/composables/useToast'
import MainLayout from '@/layouts/MainLayout.vue'
import ImportUpload from '@/components/imports/ImportUpload.vue'
import ImportList from '@/components/imports/ImportList.vue'

const importsStore = useImportsStore()
const authStore = useAuthStore()
const { subscribeToImports, unsubscribeFromImports, isConnected: wsConnected, connectionError } = useWebSocket()
const { success, error } = useToast()

let channel = null

const refreshImports = async () => {
  await importsStore.fetchImports()
  success('Import list refreshed')
}

const reconnectWebSocket = () => {
  console.log('Manual reconnection triggered')
  setupWebSocket()
}

const setupWebSocket = () => {
  // Unsubscribe from previous channel if exists
  if (channel && authStore.user) {
    unsubscribeFromImports(authStore.user.id)
    channel = null
  }

  // Subscribe to WebSocket events
  if (!authStore.user) {
    console.error('No user available for WebSocket subscription')
    return
  }

  console.log('Setting up WebSocket subscription for user:', authStore.user.id)
  
  channel = subscribeToImports(authStore.user.id, {
    onProgress: (data) => {
      console.log('Progress event received in component:', data)
      importsStore.updateImportProgress(data)
    },
    onCompleted: (data) => {
      console.log('Completion event received in component:', data)
      importsStore.updateImportProgress(data)
      success(`Import completed: ${data.filename}`)
    }
  })
}

onMounted(async () => {
  console.log('ImportsView mounted')
  await importsStore.fetchImports()
  
  // Setup WebSocket after a short delay to ensure auth is ready
  setTimeout(() => {
    setupWebSocket()
  }, 100)
})

onUnmounted(() => {
  console.log('ImportsView unmounting')
  if (authStore.user && channel) {
    unsubscribeFromImports(authStore.user.id)
  }
})

const handleDelete = async (id) => {
  try {
    await importsStore.deleteImport(id)
    success('Import deleted successfully')
  } catch (err) {
    error('Failed to delete import')
    console.error('Delete error:', err)
  }
}
</script>