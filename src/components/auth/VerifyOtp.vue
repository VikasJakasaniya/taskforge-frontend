<template>
  <div class="w-full max-w-md">
    <div class="card">
      <div class="text-center mb-6">
        <h2 class="text-2xl font-bold text-gray-900">Enter OTP</h2>
        <p class="mt-2 text-gray-600">
          We sent a 6-digit code to<br />
          <span class="font-medium text-gray-900">{{ email }}</span>
        </p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label for="otp" class="block text-sm font-medium text-gray-700 mb-1">
            One-Time Password
          </label>
          <input
            id="otp"
            v-model="otp"
            type="text"
            inputmode="numeric"
            pattern="[0-9]*"
            maxlength="6"
            required
            class="input text-center text-2xl tracking-widest"
            placeholder="000000"
            :disabled="loading"
            autofocus
          />
        </div>

        <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-800">{{ error }}</p>
        </div>

        <button
          type="submit"
          class="btn btn-primary w-full"
          :disabled="loading || otp.length !== 6"
        >
          <LoadingSpinner v-if="loading" size="sm" color="white" class="mr-2" />
          {{ loading ? 'Verifying...' : 'Verify OTP' }}
        </button>

        <div class="flex items-center justify-between pt-4 border-t">
          <button
            type="button"
            @click="$emit('back')"
            class="text-sm text-gray-600 hover:text-gray-900"
          >
            ← Change email
          </button>
          
          <button
            v-if="canResend"
            type="button"
            @click="handleResend"
            class="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Resend OTP
          </button>
          <span v-else class="text-sm text-gray-500">
            Resend in {{ countdown }}s
          </span>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useToast } from '@/composables/useToast'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const props = defineProps({
  email: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['back'])

const { verifyOtp, requestOtp, loading, error } = useAuth()
const { success: showSuccess } = useToast()

const otp = ref('')
const countdown = ref(60)
const canResend = ref(false)
let timer = null

const handleSubmit = async () => {
  await verifyOtp(props.email, otp.value)
}

const handleResend = async () => {
  const success = await requestOtp(props.email)
  if (success) {
    showSuccess('OTP resent successfully')
    countdown.value = 60
    canResend.value = false
    startCountdown()
  }
}

const startCountdown = () => {
  if (timer) clearInterval(timer)
  
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      canResend.value = true
      clearInterval(timer)
    }
  }, 1000)
}

onMounted(() => {
  startCountdown()
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>