<template>
  <MainLayout>
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Tasks</h1>
          <p class="mt-1 text-gray-600">Manage your tasks efficiently</p>
        </div>
        <button @click="showCreateModal = true" class="btn btn-primary">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          New Task
        </button>
      </div>

      <TaskFilters :filters="tasksStore.filters" @update="handleFilterUpdate" />
      
      <TaskList
        :tasks="tasksStore.tasks"
        :loading="tasksStore.loading"
        :meta="tasksStore.meta"
        @edit="handleEdit"
        @delete="handleDelete"
        @update-status="handleUpdateStatus"
        @page-change="handlePageChange"
      />
      
      <TaskModal
        v-model="showCreateModal"
        :loading="submitting"
        @submit="handleCreate"
      />
      
      <TaskModal
        v-model="showEditModal"
        :task="editingTask"
        :loading="submitting"
        @submit="handleUpdate"
      />
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useTasksStore } from '@/stores/tasks'
import { useToast } from '@/composables/useToast'
import MainLayout from '@/layouts/MainLayout.vue'
import TaskList from '@/components/tasks/TaskList.vue'
import TaskFilters from '@/components/tasks/TaskFilters.vue'
import TaskModal from '@/components/tasks/TaskModal.vue'

const tasksStore = useTasksStore()
const { success, error } = useToast()

const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingTask = ref(null)
const submitting = ref(false)

onMounted(() => {
  tasksStore.fetchTasks()
})

const handleFilterUpdate = (filters) => {
  Object.keys(filters).forEach(key => {
    tasksStore.setFilter(key, filters[key])
  })
  tasksStore.fetchTasks()
}

const handlePageChange = (page) => {
  tasksStore.setPage(page)
  tasksStore.fetchTasks()
}

const handleCreate = async (formData) => {
  submitting.value = true
  try {
    await tasksStore.createTask(formData)
    success('Task created successfully')
    showCreateModal.value = false
  } catch (err) {
    error(err.response?.data?.message || 'Failed to create task')
  } finally {
    submitting.value = false
  }
}

const handleEdit = (task) => {
  editingTask.value = task
  showEditModal.value = true
}

const handleUpdate = async (formData) => {
  submitting.value = true
  try {
    await tasksStore.updateTask(editingTask.value.id, formData)
    success('Task updated successfully')
    showEditModal.value = false
    editingTask.value = null
  } catch (err) {
    error(err.response?.data?.message || 'Failed to update task')
  } finally {
    submitting.value = false
  }
}

const handleUpdateStatus = async (taskId, status) => {
  try {
    await tasksStore.updateTask(taskId, { status })
    success('Task status updated')
  } catch (err) {
    error('Failed to update task status')
  }
}

const handleDelete = async (taskId) => {
  try {
    await tasksStore.deleteTask(taskId)
    success('Task deleted successfully')
  } catch (err) {
    error('Failed to delete task')
  }
}
</script>