import { defineStore } from 'pinia'
import { ref } from 'vue'
import tasksApi from '@/api/tasks'

export const useTasksStore = defineStore('tasks', () => {
    const tasks = ref([])
    const currentTask = ref(null)
    const loading = ref(false)
    const meta = ref({
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: 0
    })

    const filters = ref({
        status: '',
        priority: '',
        search: '',
        sort_by: 'created_at',
        sort_direction: 'desc',
        per_page: 15,
        page: 1
    })

    const fetchTasks = async () => {
        loading.value = true
        try {
            const response = await tasksApi.getTasks(filters.value)
            tasks.value = response.data.data
            meta.value = response.data.meta
        } finally {
            loading.value = false
        }
    }

    const createTask = async (taskData) => {
        const response = await tasksApi.createTask(taskData)
        await fetchTasks() // Refresh list
        return response.data.data
    }

    const updateTask = async (id, taskData) => {
        const response = await tasksApi.updateTask(id, taskData)
        await fetchTasks() // Refresh list
        return response.data.data
    }

    const deleteTask = async (id) => {
        await tasksApi.deleteTask(id)
        await fetchTasks() // Refresh list
    }

    const setFilter = (key, value) => {
        filters.value[key] = value
        filters.value.page = 1 // Reset to first page
    }

    const setPage = (page) => {
        filters.value.page = page
    }

    return {
        tasks,
        currentTask,
        loading,
        meta,
        filters,
        fetchTasks,
        createTask,
        updateTask,
        deleteTask,
        setFilter,
        setPage
    }
})