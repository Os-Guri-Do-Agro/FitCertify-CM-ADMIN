<template>
   <v-container>
    <h2 class="mb-4">Artigos:</h2>
    <v-row v-if="teste.success">
      <v-col
        v-for="artigo in teste.data"
        :key="artigo.id"
        cols="12"
        md="6"
        lg="4"
      >
        <v-card>
          <v-img :src="artigo.imagemUrl" height="200px" cover></v-img>

          <v-card-title>{{ artigo.titulo }}</v-card-title>
          <v-card-subtitle>{{ artigo.subTitulo }}</v-card-subtitle>

          <v-card-text>
            {{ artigo.conteudo }}
            <br />
            <strong>Categoria:</strong> {{ artigo.categoriaArtigo.nome }}
          </v-card-text>

          <v-card-actions>
            <v-chip v-if="artigo.isMobile" color="blue" text-color="white" small>Mobile</v-chip>
            <v-chip v-if="artigo.isDesktop" color="green" text-color="white" small>Desktop</v-chip>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import artigoService from '@/services/artigo/artigo-service'

const teste = ref([])

onMounted(async () => {
  try {
    const response = await artigoService.getAllArtigos()
    teste.value = response
    console.log('Artigos:', teste.value)
  } catch (error) {
    console.error('Erro ao carregar artigos:', error)
  }
})
</script>
