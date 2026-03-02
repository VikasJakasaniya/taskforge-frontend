import api from './axios'

export default {
    getTasks(params = {}) {
        return api.get('/api/tasks', { params })
    },

    getTask(id) {
        return api.get(`/api/tasks/${id}`)
    },

    createTask(data) {
        return api.post('/api/tasks', data)
    },

    updateTask(id, data) {
        return api.patch(`/api/tasks/${id}`, data)
    },

    deleteTask(id) {
        return api.delete(`/api/tasks/${id}`)
    }
}