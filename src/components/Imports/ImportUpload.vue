<template>
  <div class="card">
    <h2 class="text-lg font-semibold text-gray-900 mb-4">Upload CSV File</h2>
    
    <div class="space-y-4">
      <div
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="handleDrop"
        :class="[
          'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
          isDragging ? 'border-primary-500 bg-primary-50' : 'border-gray-300'
        ]"
      >
        <input
          ref="fileInput"
          type="file"
          accept=".csv"
          @change="handleFileSelect"
          class="hidden"
        />
        
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        
        <div class="mt-4">
          <button
            type="button"
            @click="$refs.fileInput.click()"
            class="btn btn-primary"
          >
            Select CSV File
          </button>
          <p class="mt-2 text-sm text-gray-500">or drag and drop here</p>
        </div>
        
        <p class="mt-2 text-xs text-gray-500">CSV file up to 10MB</p>
      </div>
      
      <div v-if="selectedFile" class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div class="flex items-center gap-3">
          <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p class="text-sm font-medium text-gray-900">{{ selectedFile.name }}</p>
            <p class="text-xs text-gray-500">{{ formatFileSize(selectedFile.size) }}</p>
          </div>
        </div>
        
        <button
          @click="clearFile"
          class="text-gray-400 hover:text-red-600"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 class="text-sm font-medium text-blue-900 mb-2">CSV Format</h3>
        <p class="text-xs text-blue-800">
          Your CSV should have these columns: <code class="bg-blue-100 px-1 py-0.5 rounded">title</code>,
          <code class="bg-blue-100 px-1 py-0.5 rounded">description</code>,
          <code class="bg-blue-100 px-1 py-0.5 rounded">status</code>,
          <code class="bg-blue-100 px-1 py-0.5 rounded">priority</code>,
          <code class="bg-blue-100 px-1 py-0.5 rounded">due_date</code>
        </p>
      </div>
      
      <button
        @click="handleUpload"
        :disabled="!selectedFile || uploading"
        class="btn btn-primary w-full"
      >
        <LoadingSpinner v-if="uploading" size="sm" color="white" class="mr-2" />
        {{ uploading ? 'Uploading...' : 'Upload and Import' }}
      </button>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import { useImportsStore } from '@/stores/imports'
  import { useToast } from '@/composables/useToast'
  import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

  const importsStore = useImportsStore()
  const { success, error } = useToast()

  const fileInput = ref(null)
  const selectedFile = ref(null)
  const isDragging = ref(false)
  const uploading = ref(false)

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
      validateAndSetFile(file)
    }
  }

  const handleDrop = (event) => {
    isDragging.value = false
    const file = event.dataTransfer.files[0]
    if (file) {
      validateAndSetFile(file)
    }
  }

  const validateAndSetFile = (file) => {
    if (!file.name.endsWith('.csv')) {
      error('Please select a CSV file')
      return
    }
    
    if (file.size > 10 * 1024 * 1024) {
      error('File size must be less than 10MB')
      return
    }
    
    selectedFile.value = file
  }

  const clearFile = () => {
    selectedFile.value = null
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }

  const handleUpload = async () => {
    if (!selectedFile.value) return
    
    uploading.value = true
    try {
      await importsStore.uploadImport(selectedFile.value)
      success('Import started successfully')
      clearFile()
    } catch (err) {
      error(err.response?.data?.message || 'Failed to upload file')
    } finally {
      uploading.value = false
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }
</script>