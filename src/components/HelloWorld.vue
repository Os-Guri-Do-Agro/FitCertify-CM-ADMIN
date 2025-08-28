<template>
  <v-container fluid class="pa-6">
    <div class="mb-6">
      <h1 class="text-h4 font-weight-bold mb-2">Dashboard</h1>
      <p class="text-subtitle-1 text-medium-emphasis">Visão geral do sistema</p>
    </div>
    <!-- Cards de Estatísticas -->
    <v-row class="mb-6">
      <v-col v-for="stat in stats" :key="stat.title" cols="12" sm="6" md="3">
        <v-card class="pa-4" elevation="2">
          <div class="d-flex align-center">
            <v-avatar :color="stat.color" size="48" class="mr-4">
              <v-icon :icon="stat.icon" color="white"></v-icon>
            </v-avatar>
            <div>
              <div class="text-h5 font-weight-bold">{{ stat.value }}</div>
              <div class="text-body-2 text-medium-emphasis">{{ stat.title }}</div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Gráficos -->
    <v-row>
      <v-col cols="12" md="8">
        <v-card class="pa-4" elevation="2">
          <v-card-title class="text-h6 font-weight-bold mb-4">Usuários Ativos</v-card-title>
          <div class="chart-container" style="height: 300px; position: relative;">
            <svg width="100%" height="100%" viewBox="0 0 600 300">
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style="stop-color:#2196F3;stop-opacity:0.3" />
                  <stop offset="100%" style="stop-color:#2196F3;stop-opacity:0" />
                </linearGradient>
              </defs>
              <polyline
                fill="url(#gradient)"
                stroke="#2196F3"
                stroke-width="3"
                points="50,250 100,200 150,180 200,160 250,140 300,120 350,100 400,90 450,80 550,60"
              />
              <polyline
                fill="none"
                stroke="#2196F3"
                stroke-width="3"
                points="50,250 100,200 150,180 200,160 250,140 300,120 350,100 400,90 450,80 550,60"
              />
            </svg>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="pa-4" elevation="2">
          <v-card-title class="text-h6 font-weight-bold mb-4">Distribuição por Categoria</v-card-title>
          <div class="chart-container" style="height: 300px; display: flex; align-items: center; justify-content: center;">
            <svg width="200" height="200" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="80" fill="none" stroke="#E3F2FD" stroke-width="20"/>
              <circle cx="100" cy="100" r="80" fill="none" stroke="#2196F3" stroke-width="20"
                      stroke-dasharray="251" stroke-dashoffset="75" transform="rotate(-90 100 100)"/>
              <circle cx="100" cy="100" r="80" fill="none" stroke="#4CAF50" stroke-width="20"
                      stroke-dasharray="125" stroke-dashoffset="0" transform="rotate(90 100 100)"/>
              <circle cx="100" cy="100" r="80" fill="none" stroke="#FF9800" stroke-width="20"
                      stroke-dasharray="63" stroke-dashoffset="0" transform="rotate(180 100 100)"/>
            </svg>
          </div>
          <div class="mt-4">
            <div class="d-flex align-center mb-2">
              <div class="mr-2" style="width: 12px; height: 12px; background: #2196F3; border-radius: 50%;"></div>
              <span class="text-body-2">Fitness (0%)</span>
            </div>
            <div class="d-flex align-center mb-2">
              <div class="mr-2" style="width: 12px; height: 12px; background: #4CAF50; border-radius: 50%;"></div>
              <span class="text-body-2">Nutrição (0%)</span>
            </div>
            <div class="d-flex align-center">
              <div class="mr-2" style="width: 12px; height: 12px; background: #FF9800; border-radius: 50%;"></div>
              <span class="text-body-2">Outros (0%)</span>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Atividade Recente -->

  </v-container>
</template>

<script setup>
import usersService from '@/services/users/users-service';
import artigoService from '@/services/artigo/artigo-service';
import { onMounted,ref } from 'vue';
const CountActiveUsers = ref()
const CountArtigosAtivo = ref()

  const stats = [
    {
      title: 'Usuários Ativos',
      value: CountActiveUsers,
      icon: 'mdi-account-group',
      color: 'blue'
    },
    {
      title: 'Artigos Publicados',
      value: CountArtigosAtivo,
      icon: 'mdi-post',
      color: 'green'
    },
    {
      title: 'Produtos Vendidos',
      value: '0',
      icon: 'mdi-cart',
      color: 'orange'
    },
    {
      title: 'Receita Total',
      value: 'R$ 0,00',
      icon: 'mdi-currency-usd',
      color: 'purple'
    }
  ]


  onMounted(async () => {
    const response = await usersService.getAllUsers()
    CountActiveUsers.value = response.data.filter(e => e.ativo == true).length
    const responseArtigos = await artigoService.getAllArtigos()
    CountArtigosAtivo.value = responseArtigos.data.filter(e => e.ativo == true).length
  })
</script>
