import api from './axios'

export default {
    requestOtp(email) {
        return api.post('/api/auth/request-otp', { email })
    },

    verifyOtp(email, otp) {
        return api.post('/api/auth/verify-otp', { email, otp })
    },

    logout() {
        return api.post('/api/auth/logout')
    },

    me() {
        return api.get('/api/auth/me')
    }
}