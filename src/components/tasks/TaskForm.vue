<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div>
      <label for="title" class="block text-sm font-medium text-gray-700 mb-1">
        Title <span class="text-red-500">*</span>
      </label>
      <input
        id="title"
        v-model="form.title"
        type="text"
        required
        class="input"
        placeholder="Task title"
      />
    </div>

    <div>
      <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
        Description
      </label>
      <textarea
        id="description"
        v-model="form.description"
        rows="4"
        class="input"
        placeholder="Task description (optional)"
      ></textarea>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label for="status" class="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select id="status" v-model="form.status" class="input">
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      <div>
        <label for="priority" class="block text-sm font-medium text-gray-700 mb-1">
          Priority
        </label>
        <select id="priority" v-model="form.priority" class="input">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div>
        <label for="due_date" class="block text-sm font-medium text-gray-700 mb-1">
          Due Date
        </label>
        <input
          id="due_date"
          v-model="form.due_date"
          type="date"
          class="input"
        />
      </div>
    </div>

    <div class="flex justify-end gap-3 pt-4">
      <button
        type="button"
        @click="$emit('cancel')"
        class="btn btn-secondary"
      >
        Cancel
      </button>
      <button
        type="submit"
        class="btn btn-primary"
        :disabled="loading"
      >
        <LoadingSpinner v-if="loading" size="sm" color="white" class="mr-2" />
        {{ isEdit ? 'Update Task' : 'Create Task' }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, watch } from 'vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const props = defineProps({
  task: {
    type: Object,
    default: null
  },
  loading: Boolean
})

const emit = defineEmits(['submit', 'cancel'])

const isEdit = ref(!!props.task)

const form = ref({
  title: '',
  description: '',
  status: 'pending',
  priority: 'medium',
  due_date: ''
})

watch(() => props.task, (newTask) => {
  if (newTask) {
    form.value = {
      title: newTask.title || '',
      description: newTask.description || '',
      status: newTask.status || 'pending',
      priority: newTask.priority || 'medium',
      due_date: newTask.due_date || ''
    }
    isEdit.value = true
  } else {
    form.value = {
      title: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      due_date: ''
    }
    isEdit.value = false
  }
}, { immediate: true })

const handleSubmit = () => {
  emit('submit', { ...form.value })
}
</script>