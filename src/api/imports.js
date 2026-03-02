import api from './axios'

export default {
    getImports() {
        return api.get('/api/imports')
    },

    getImport(id) {
        return api.get(`/api/imports/${id}`)
    },

    uploadImport(file) {
        const formData = new FormData()
        formData.append('file', file)

        return api.post('/api/imports', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    },

    deleteImport(id) {
        return api.delete(`/api/imports/${id}`)
    }
}