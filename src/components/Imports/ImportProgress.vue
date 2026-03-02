<template>
  <div class="card">
    <div class="flex items-start justify-between gap-4">
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-3 mb-2">
          <h3 class="text-base font-semibold text-gray-900 truncate">
            {{ importData.filename }}
          </h3>
          <span :class="statusClass" class="px-2 py-1 text-xs font-medium rounded-full">
            {{ importData.status }}
          </span>
        </div>
        
        <div class="space-y-3">
          <div class="w-full bg-gray-200 rounded-full h-2.5">
            <div
              class="h-2.5 rounded-full transition-all duration-300"
              :class="progressBarClass"
              :style="{ width: `${importData.progress_percentage}%` }"
            ></div>
          </div>
          
          <div class="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span class="text-gray-500">Total:</span>
              <span class="ml-1 font-medium text-gray-900">{{ importData.total_rows }}</span>
            </div>
            <div>
              <span class="text-gray-500">Processed:</span>
              <span class="ml-1 font-medium text-green-600">{{ importData.processed_rows }}</span>
            </div>
            <div>
              <span class="text-gray-500">Failed:</span>
              <span class="ml-1 font-medium text-red-600">{{ importData.failed_rows }}</span>
            </div>
          </div>
          
          <p class="text-xs text-gray-500">
            {{ formatDate(importData.created_at) }}
          </p>
        </div>
      </div>
      
      <button
        v-if="importData.status === 'completed' || importData.status === 'failed'"
        @click="handleDelete"
        class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        title="Delete import"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  importData: Object
})

const emit = defineEmits(['delete'])

const statusClass = computed(() => {
  const classes = {
    queued: 'bg-gray-100 text-gray-800',
    processing: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800'
  }
  return classes[props.importData.status]
})

const progressBarClass = computed(() => {
  const classes = {
    queued: 'bg-gray-500',
    processing: 'bg-blue-500',
    completed: 'bg-green-500',
    failed: 'bg-red-500'
  }
  return classes[props.importData.status]
})

const handleDelete = () => {
  if (confirm('Are you sure you want to delete this import record?')) {
    emit('delete')
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>