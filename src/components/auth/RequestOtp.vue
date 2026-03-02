<template>
  <div class="w-full max-w-md">
    <div class="card">
      <div class="text-center mb-6">
        <h2 class="text-2xl font-bold text-gray-900">Welcome to TaskForge</h2>
        <p class="mt-2 text-gray-600">Enter your email to receive a one-time password</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            class="input"
            placeholder="you@example.com"
            :disabled="loading"
          />
        </div>

        <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-800">{{ error }}</p>
        </div>

        <button
          type="submit"
          class="btn btn-primary w-full"
          :disabled="loading"
        >
          <LoadingSpinner v-if="loading" size="sm" color="white" class="mr-2" />
          {{ loading ? 'Sending...' : 'Send OTP' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const emit = defineEmits(['otp-sent'])

const { requestOtp, loading, error } = useAuth()
const email = ref('')

const handleSubmit = async () => {
  const success = await requestOtp(email.value)
  if (success) {
    emit('otp-sent', email.value)
  }
}
</script>