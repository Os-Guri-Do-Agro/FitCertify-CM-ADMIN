<template>
  <v-container fluid class="pa-6">
    <!-- Header Section -->
    <v-row class="mb-6">
      <v-col cols="12">
        <div class="d-flex flex-column flex-sm-row justify-space-between align-start align-sm-center ga-4">
          <div class="header-content">
            <h1 class="text-h3 font-weight-bold text-primary mb-2">
              <v-icon icon="mdi-store" class="me-3" size="large"></v-icon>
              Editar Afiliado
            </h1>
            <p class="text-subtitle-1 text-medium-emphasis mb-0">
              Edite um os afiliados do sistema
            </p>
          </div>
          <router-link :to="{ path: '/afiliados/' }">
            <v-btn
              color="grey-darken-1"
              variant="outlined"
              size="large"
              prepend-icon="mdi-arrow-left"
              class="back-btn"
            >
              Voltar
            </v-btn>
          </router-link>
        </div>
      </v-col>
    </v-row>
    <EditFormAfiliados :id="id" />
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import EditFormAfiliados from '@/components/afiliados/EditFormAfiliados.vue'

const id = ref<string | undefined>()

onMounted(() => {
  id.value = (window as any).editingAfiliadoId
})
</script>

<style scoped>
.header-content {
  flex: 1;
}

.back-btn {
  transition: all 0.3s ease;
}

.back-btn:hover {
  transform: translateX(-4px);
}

@media (max-width: 600px) {
  .header-content h1 {
    font-size: 1.75rem !important;
  }
}
</style>