<template>
  <div class="space-y-4">
    <div v-if="loading" class="flex justify-center py-12">
      <LoadingSpinner size="lg" />
    </div>

    <div v-else-if="tasks.length === 0" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No tasks found</h3>
      <p class="mt-1 text-sm text-gray-500">Get started by creating a new task.</p>
    </div>

    <div v-else class="space-y-3">
      <TaskItem
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        @edit="$emit('edit', task)"
        @delete="$emit('delete', task.id)"
        @update-status="$emit('update-status', task.id, $event)"
      />
    </div>

    <!-- Pagination -->
    <div v-if="meta.last_page > 1" class="flex items-center justify-between border-t pt-4">
      <div class="text-sm text-gray-700">
        Showing <span class="font-medium">{{ (meta.current_page - 1) * meta.per_page + 1 }}</span>
        to <span class="font-medium">{{ Math.min(meta.current_page * meta.per_page, meta.total) }}</span>
        of <span class="font-medium">{{ meta.total }}</span> results
      </div>
      
      <div class="flex gap-2">
        <button
          @click="$emit('page-change', meta.current_page - 1)"
          :disabled="meta.current_page === 1"
          class="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Previous
        </button>
        
        <button
          v-for="page in visiblePages"
          :key="page"
          @click="$emit('page-change', page)"
          :class="[
            'px-3 py-1 border rounded-md text-sm',
            page === meta.current_page
              ? 'bg-primary-600 text-white border-primary-600'
              : 'hover:bg-gray-50'
          ]"
        >
          {{ page }}
        </button>
        
        <button
          @click="$emit('page-change', meta.current_page + 1)"
          :disabled="meta.current_page === meta.last_page"
          class="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import TaskItem from './TaskItem.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const props = defineProps({
  tasks: Array,
  loading: Boolean,
  meta: Object
})

defineEmits(['edit', 'delete', 'update-status', 'page-change'])

const visiblePages = computed(() => {
  const current = props.meta.current_page
  const last = props.meta.last_page
  const delta = 2
  const pages = []
  
  for (let i = Math.max(1, current - delta); i <= Math.min(last, current + delta); i++) {
    pages.push(i)
  }
  
  return pages
})
</script>