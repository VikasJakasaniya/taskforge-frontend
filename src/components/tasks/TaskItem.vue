<template>
  <div class="card hover:shadow-md transition-shadow">
    <div class="flex items-start justify-between gap-4">
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-3 mb-2">
          <h3 class="text-lg font-semibold text-gray-900 truncate">
            {{ task.title }}
          </h3>
          
          <span :class="priorityClass(task.priority)" class="px-2 py-1 text-xs font-medium rounded-full">
            {{ task.priority }}
          </span>
        </div>
        
        <p v-if="task.description" class="text-gray-600 mb-3 line-clamp-2">
          {{ task.description }}
        </p>
        
        <div class="flex items-center gap-4 text-sm text-gray-500">
          <div v-if="task.due_date" class="flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{{ formatDate(task.due_date) }}</span>
          </div>
          
          <div class="flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ formatDateTime(task.created_at) }}</span>
          </div>
        </div>
      </div>
      
      <div class="flex items-start gap-2">
        <select
          v-model="localStatus"
          @change="handleStatusChange"
          :class="statusClass(localStatus)"
          class="px-3 py-1 text-sm font-medium rounded-lg border-0 cursor-pointer focus:ring-2 focus:ring-primary-500"
        >
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        
        <button
          @click="$emit('edit')"
          class="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
          title="Edit task"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        
        <button
          @click="handleDelete"
          class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete task"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  task: Object
})

const emit = defineEmits(['edit', 'delete', 'update-status'])

const localStatus = ref(props.task.status)

watch(() => props.task.status, (newStatus) => {
  localStatus.value = newStatus
})

const handleStatusChange = () => {
  emit('update-status', localStatus.value)
}

const handleDelete = () => {
  if (confirm('Are you sure you want to delete this task?')) {
    emit('delete')
  }
}

const priorityClass = (priority) => {
  const classes = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  }
  return classes[priority]
}

const statusClass = (status) => {
  const classes = {
    pending: 'bg-gray-100 text-gray-800',
    in_progress: 'bg-blue-100 text-blue-800',
    done: 'bg-green-100 text-green-800'
  }
  return classes[status]
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>