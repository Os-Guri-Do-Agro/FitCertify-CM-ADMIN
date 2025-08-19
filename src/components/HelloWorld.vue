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
              <span class="text-body-2">Fitness (45%)</span>
            </div>
            <div class="d-flex align-center mb-2">
              <div class="mr-2" style="width: 12px; height: 12px; background: #4CAF50; border-radius: 50%;"></div>
              <span class="text-body-2">Nutrição (30%)</span>
            </div>
            <div class="d-flex align-center">
              <div class="mr-2" style="width: 12px; height: 12px; background: #FF9800; border-radius: 50%;"></div>
              <span class="text-body-2">Outros (25%)</span>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Atividade Recente -->

  </v-container>
</template>

<script setup lang="ts">
  const stats = [
    {
      title: 'Usuários Ativos',
      value: '1,234',
      icon: 'mdi-account-group',
      color: 'blue'
    },
    {
      title: 'Artigos Publicados',
      value: '89',
      icon: 'mdi-post',
      color: 'green'
    },
    {
      title: 'Produtos Vendidos',
      value: '456',
      icon: 'mdi-cart',
      color: 'orange'
    },
    {
      title: 'Receita Total',
      value: 'R$ 12.5k',
      icon: 'mdi-currency-usd',
      color: 'purple'
    }
  ]

  const activities = [
    {
      id: 1,
      title: 'Novo usuário cadastrado',
      time: 'há 2 minutos',
      icon: 'mdi-account-plus',
      color: 'green'
    },
    {
      id: 2,
      title: 'Artigo "Treino HIIT" publicado',
      time: 'há 15 minutos',
      icon: 'mdi-post',
      color: 'blue'
    },
    {
      id: 3,
      title: 'Produto vendido no marketplace',
      time: 'há 1 hora',
      icon: 'mdi-cart',
      color: 'orange'
    },
    {
      id: 4,
      title: 'Backup do sistema realizado',
      time: 'há 2 horas',
      icon: 'mdi-backup-restore',
      color: 'grey'
    }
  ]
</script>
