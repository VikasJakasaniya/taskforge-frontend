<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 p-4">
    <Transition name="fade" mode="out-in">
      <RequestOtp v-if="!otpSent" @otp-sent="handleOtpSent" :key="'request'" />
      <VerifyOtp v-else :email="email" @back="handleBack" :key="'verify'" />
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import RequestOtp from '@/components/auth/RequestOtp.vue'
import VerifyOtp from '@/components/auth/VerifyOtp.vue'

const otpSent = ref(false)
const email = ref('')

const handleOtpSent = (userEmail) => {
  email.value = userEmail
  otpSent.value = true
}

const handleBack = () => {
  otpSent.value = false
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>