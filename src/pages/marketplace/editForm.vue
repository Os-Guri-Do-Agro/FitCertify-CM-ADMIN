<template>
  <v-container fluid class="pa-6">
<v-row>
<v-col cols="6" class="text-start">
 <div class="header-content">
            <h1 class="text-h3 font-weight-bold text-primary mb-2">
              <v-icon icon="mdi-newspaper-variant" class="me-3" size="large"></v-icon>
              Editar Marketplace
            </h1>
 <p class="text-subtitle-1 text-medium-emphasis mb-0">
            Edite seu Marketplace
            </p>
          </div>
          </v-col>
          <v-col cols="6" class="text-end">
  <router-link to="/marketplace">
    <v-btn color="primary" size="large" prepend-icon="mdi-arrow-left" class="create-btn" elevation="2">
      Voltar
    </v-btn>
  </router-link>
</v-col>
</v-row>
<EditFormArtigo :id="id" />
</v-container>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue'

const id = ref<string | undefined>()

onMounted(() => {
  id.value = (window as any).editingArticleId
  console.log('ID para edição:', id.value)
})
</script>
