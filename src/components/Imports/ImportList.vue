<template>
  <div class="space-y-4">
    <div v-if="loading" class="flex justify-center py-12">
      <LoadingSpinner size="lg" />
    </div>

    <div v-else-if="imports.length === 0" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No imports yet</h3>
      <p class="mt-1 text-sm text-gray-500">Upload a CSV file to get started.</p>
    </div>

    <div v-else class="space-y-3">
      <ImportProgress
        v-for="importItem in imports"
        :key="importItem.id"
        :import-data="importItem"
        @delete="$emit('delete', importItem.id)"
      />
    </div>
  </div>
</template>

<script setup>
import ImportProgress from './ImportProgress.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

defineProps({
  imports: Array,
  loading: Boolean
})

defineEmits(['delete'])
</script>