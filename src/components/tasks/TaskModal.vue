<template>
  <Modal
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :title="task ? 'Edit Task' : 'Create Task'"
  >
    <TaskForm
      :task="task"
      :loading="loading"
      @submit="handleSubmit"
      @cancel="$emit('update:modelValue', false)"
    />
  </Modal>
</template>

<script setup>
import Modal from '@/components/common/Modal.vue'
import TaskForm from './TaskForm.vue'

defineProps({
  modelValue: Boolean,
  task: Object,
  loading: Boolean
})

const emit = defineEmits(['update:modelValue', 'submit'])

const handleSubmit = (formData) => {
  emit('submit', formData)
}
</script>