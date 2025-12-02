<template>
  <EditFormOrganizacao :id="organizacaoId" />
</template>

<script setup lang="ts">
import EditFormOrganizacao from '@/components/evento/EditFormOrganizacao.vue'
import { onMounted, ref } from 'vue'

const organizacaoId = ref('')

onMounted(() => {
  organizacaoId.value = (window as any).editingOrganizacaoId || ''
})
</script>