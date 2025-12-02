<template>
  <EditFormEmpresa :id="empresaId" />
</template>

<script setup lang="ts">
import EditFormEmpresa from '@/components/marketplace/EditFormEmpresa.vue'
import { onMounted, ref } from 'vue'

const empresaId = ref('')

onMounted(() => {
  empresaId.value = (window as any).editingEmpresaId || ''
})
</script>