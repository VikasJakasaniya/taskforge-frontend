import { defineStore } from 'pinia'
import { ref } from 'vue'
import importsApi from '@/api/imports'

export const useImportsStore = defineStore('imports', () => {
    const imports = ref([])
    const loading = ref(false)

    const fetchImports = async () => {
        loading.value = true
        try {
            const response = await importsApi.getImports()
            imports.value = response.data.data
        } finally {
            loading.value = false
        }
    }

    const uploadImport = async (file) => {
        const response = await importsApi.uploadImport(file)
        await fetchImports() // Refresh list
        return response.data.data
    }

    const updateImportProgress = (importData) => {
        const index = imports.value.findIndex(i => i.id === importData.id)
        if (index !== -1) {
            imports.value[index] = {
                ...imports.value[index],
                ...importData
            }
        }
    }

    const deleteImport = async (id) => {
        await importsApi.deleteImport(id)
        await fetchImports()
    }

    return {
        imports,
        loading,
        fetchImports,
        uploadImport,
        updateImportProgress,
        deleteImport
    }
})