import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import authApi from '@/api/auth'
import { useRouter } from 'vue-router'

export function useAuth() {
    const authStore = useAuthStore()
    const router = useRouter()
    const loading = ref(false)
    const error = ref(null)

    const requestOtp = async (email) => {
        loading.value = true
        error.value = null
        try {
            await authApi.requestOtp(email)
            return true
        } catch (err) {
            error.value = err.response?.data?.message || 'Failed to send OTP'
            return false
        } finally {
            loading.value = false
        }
    }

    const verifyOtp = async (email, otp) => {
        loading.value = true
        error.value = null
        try {
            const response = await authApi.verifyOtp(email, otp)
            authStore.setAuth(response.data.token, response.data.user)
            router.push('/tasks')
            return true
        } catch (err) {
            error.value = err.response?.data?.message || 'Invalid OTP'
            return false
        } finally {
            loading.value = false
        }
    }

    const logout = async () => {
        await authStore.logout()
        router.push('/login')
    }

    return {
        loading,
        error,
        requestOtp,
        verifyOtp,
        logout
    }
}