<template>
  <v-container fluid class="pa-6">

    <v-row class="mb-8">
      <v-col cols="12">
        <v-card class="pa-6 gradient-header" elevation="2">
          <div class="d-flex flex-column flex-sm-row align-start align-sm-center justify-space-between w-100">
            <div>
              <h1 class="text-h4 font-weight-bold text-white mb-2 d-flex align-center">
                <v-icon icon="mdi-shield-search" class="me-3 text-white" size="32"></v-icon>
                Auditoria
              </h1>
              <p class="text-body-1 text-white opacity-80 mb-0">
                Monitoramento de cadastros e acessos da landing page promocional.
              </p>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>


    <v-tabs v-model="activeTab" class="mb-6">
      <v-tab value="cadastros">Cadastros (Fem/Masc)</v-tab>
      <v-tab value="parabens">Cadastro Parabéns</v-tab>
    </v-tabs>

    <v-row no-gutters class="mb-6 pl-5 d-flex">
      <v-col cols="2" class="d-flex flex-column ga-2">
        <div class="d-flex align-center">
          <div class="legend-circle blue"></div>
          <span class="ml-2">Total</span>
        </div>
        <div class="d-flex align-center" v-if="activeTab === 'cadastros'">
          <div class="legend-circle pink"></div>
          <span class="ml-2">Feminino</span>
        </div>
        <div class="d-flex align-center" v-if="activeTab === 'cadastros'">
          <div class="legend-circle green"></div>
          <span class="ml-2">Masculino</span>
        </div>
      </v-col>

      <v-col cols="1" class="text-center">
        <v-progress-circular :indeterminate="initEffect" :model-value="currentMetrics.total" :rotate="-90"
          :size="100" :width="15" color="blue" class="mr-6">
          {{ currentMetrics.total }}
        </v-progress-circular>
      </v-col>
      <v-col cols="1" class="text-center" v-if="activeTab === 'cadastros'">
        <v-progress-circular :indeterminate="initEffect" :model-value="currentMetrics.feminino" :rotate="-90"
          :size="100" :width="15" color="pink" class="mr-6">
          {{ currentMetrics.feminino }}
        </v-progress-circular>
      </v-col>
      <v-col cols="1" class="text-center" v-if="activeTab === 'cadastros'">
        <v-progress-circular :indeterminate="initEffect" :model-value="currentMetrics.masculino" :rotate="-90"
          :size="100" :width="15" color="green" class="mr-6">
          {{ currentMetrics.masculino }}
        </v-progress-circular>
      </v-col>
    </v-row>


    <v-card class="main-card" elevation="3">

      <v-card-title class="pa-6 pb-4">
        <div class="d-flex flex-column flex-sm-row align-start align-sm-center ga-4 w-100">
          <div class="d-flex align-center">
            <v-icon icon="mdi-table" class="me-2" color="primary"></v-icon>
            <span class="text-h6 font-weight-medium">Auditado</span>
          </div>
          <v-spacer class="d-none d-sm-flex"></v-spacer>
          <v-text-field v-model="search" density="comfortable" label="Buscar Nomes..." prepend-inner-icon="mdi-magnify"
            variant="outlined" hide-details single-line class="search-field" style="max-width: 300px"></v-text-field>
        </div>
      </v-card-title>

      <v-divider></v-divider>


      <v-data-table v-model:search="search" :filter-keys="['nomeCompleto']" :headers="headers" :items="filteredRelatos"
        :loading="loading" class="custom-table" hover>

        <template v-slot:loading>
          <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
        </template>


        <template v-slot:item.createdAt="{ item }">
          {{ dayjs(item.validade).utcOffset('0').format('DD/MM/YYYY') }}
        </template>

        <template v-slot:item.acessouObrigado="{ item }">
          <v-chip variant="flat" :color="item.acessouObrigado === true ? 'blue' : 'orange'">{{ item.acessouObrigado ===
            true ? 'Sim' : 'Não' }}</v-chip>
        </template>

        <template v-slot:no-data>
          <div class="text-center pa-8">
            <v-icon icon="mdi-newspaper-variant-outline" size="64" color="grey-lighten-1" class="mb-4"></v-icon>
            <div class="text-h6 text-medium-emphasis mb-2">
              Nenhuma cadastro encontrado
            </div>
            <div class="text-body-2 text-medium-emphasis">
              Aguarde cadastros para conseguir ver os dados
            </div>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </v-container>

</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import 'vue3-toastify/dist/index.css'
import 'vue3-toastify/dist/index.css'
import auditoriaService from '@/services/auditoria/auditoria-service'

const search = ref('')
const relatos = ref<any[]>([])
const loading = ref(true)
const initEffect = ref(false)
const activeTab = ref('cadastros')

const filteredRelatos = computed(() => {
  if (activeTab.value === 'cadastros') {
    return relatos.value.filter(r =>
      r.promocaoRef === 'Fitcertify - Cadastre-se Feminino' ||
      r.promocaoRef === 'Fitcertify - Cadastre-se Masculino'
    )
  } else {
    return relatos.value.filter(r => r.promocaoRef === 'Fitcertify - Cadastro Parabéns')
  }
})

const currentMetrics = computed(() => {
  if (activeTab.value === 'cadastros') {
    const fem = relatos.value.filter(r => r.promocaoRef === 'Fitcertify - Cadastre-se Feminino').length
    const mas = relatos.value.filter(r => r.promocaoRef === 'Fitcertify - Cadastre-se Masculino').length
    return { total: fem + mas, feminino: fem, masculino: mas }
  } else {
    const parabens = relatos.value.filter(r => r.promocaoRef === 'Fitcertify - Cadastro Parabéns').length
    return { total: parabens, feminino: 0, masculino: 0 }
  }
})

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import 'vue3-toastify/dist/index.css'
dayjs.extend(utc)


const headers = [
  { title: 'Nome Completo', key: 'nomeCompleto', sortable: true, align: 'center' as const },
  { title: 'Número Whatsapp', key: 'numberWhatsapp', sortable: true, align: 'center' as const },
  { title: 'email', key: 'email', sortable: true, align: 'center' as const },
  { title: 'Feito na Página', key: 'promocaoRef', sortable: true, align: 'center' as const },
  { title: 'Acessou o Obrigado', key: 'acessouObrigado', sortable: true, align: 'center' as const },
  { title: 'Criado em', key: 'createdAt', sortable: true, align: 'center' as const },
]


const getAllRelatosCTA = async () => {
  try {
    const response = await auditoriaService.getAllRelatosCTA()
    relatos.value = Array.isArray(response.data) ? response.data : []
    causeEffectOnGraffic()


  } catch (error) {
    console.error('Erro ao carregar cupons:', error)
  } finally {
    loading.value = false
  }
}

const causeEffectOnGraffic = async () => {
  initEffect.value = true
  setTimeout(() => {
    initEffect.value = false
  }, 1500)
}
onMounted(async () => {
  await getAllRelatosCTA()
})
</script>

<style scoped>
.gradient-header {
  background: linear-gradient(135deg, #1976d2, #42a5f5);
  border-radius: 16px;
}

.stat-card {
  width: 160px;
  height: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  background-color: white;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.custom-table {
  border-radius: 0 0 16px 16px;
}

.legend-circle {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.legend-circle.blue {
  background-color: #2196F3;
}

.legend-circle.pink {
  background-color: #E91E63;
}

.legend-circle.green {
  background-color: #4CAF50;
}
</style>
