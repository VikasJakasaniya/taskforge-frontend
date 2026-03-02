<template>
  <div class="card">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
        <input
          v-model="localFilters.search"
          type="text"
          placeholder="Search tasks..."
          class="input"
          @input="debouncedUpdate"
        />
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select v-model="localFilters.status" @change="updateFilters" class="input">
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Priority</label>
        <select v-model="localFilters.priority" @change="updateFilters" class="input">
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
        <select v-model="localFilters.sort_by" @change="updateFilters" class="input">
          <option value="created_at">Created Date</option>
          <option value="due_date">Due Date</option>
          <option value="title">Title</option>
          <option value="priority">Priority</option>
          <option value="status">Status</option>
        </select>
      </div>
    </div>
    
    <div class="flex items-center justify-between mt-4 pt-4 border-t">
      <button
        @click="clearFilters"
        class="text-sm text-gray-600 hover:text-gray-900"
      >
        Clear filters
      </button>
      
      <div class="flex items-center gap-2">
        <span class="text-sm text-gray-600">Sort:</span>
        <button
          @click="toggleSort"
          class="p-1 hover:bg-gray-100 rounded"
          :title="localFilters.sort_direction === 'asc' ? 'Ascending' : 'Descending'"
        >
          <svg
            v-if="localFilters.sort_direction === 'asc'"
            class="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
          </svg>
          <svg
            v-else
            class="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  filters: Object
})

const emit = defineEmits(['update'])

const localFilters = ref({ ...props.filters })

let debounceTimer = null

const debouncedUpdate = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    updateFilters()
  }, 500)
}

const updateFilters = () => {
  emit('update', { ...localFilters.value })
}

const toggleSort = () => {
  localFilters.value.sort_direction = localFilters.value.sort_direction === 'asc' ? 'desc' : 'asc'
  updateFilters()
}

const clearFilters = () => {
  localFilters.value = {
    search: '',
    status: '',
    priority: '',
    sort_by: 'created_at',
    sort_direction: 'desc',
    per_page: 15,
    page: 1
  }
  updateFilters()
}

watch(() => props.filters, (newFilters) => {
  localFilters.value = { ...newFilters }
}, { deep: true })
</script>