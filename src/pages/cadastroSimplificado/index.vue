<template>
  <v-container fluid class="pa-6">

    <v-row class="mb-8">
      <v-col cols="12">
        <v-card class="pa-6 gradient-header" elevation="2">
          <div class="d-flex flex-column flex-sm-row align-start align-sm-center justify-space-between w-100">
            <div>
              <h1 class="text-h4 font-weight-bold text-white mb-2 d-flex align-center">
                <v-icon icon="mdi-format-list-group" class="me-3 text-white" size="32"></v-icon>
                Cadastros Simplificados
              </h1>
              <p class="text-body-1 text-white opacity-80 mb-0">
                Monitoramento de cadastros simplificados admin e mobile.
              </p>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>


    <v-tabs v-model="activeTab" class="mb-6">
      <v-tab value="parabens">Todal de Cadastros</v-tab>
    </v-tabs>

    <v-row no-gutters class="mb-6 pl-5 d-flex">
      <v-col cols="2" class="d-flex flex-column ga-2">
        <div class="d-flex align-center">
          <div class="legend-circle blue"></div>
          <span class="ml-2">Total</span>
        </div>
        <div class="text-h5 font-weight-bold text-primary ml-6">
          <v-progress-circular
            :model-value="cadastros.length"
            :rotate="-90"
            :size="100"
            :width="15"
            color="blue-lighten-1"
          >
            {{ cadastros.length }}
          </v-progress-circular>
        </div>
      </v-col>

      <v-col cols="1" class="text-center">

      </v-col>
    </v-row>


    <v-card class="main-card" elevation="3">

      <v-card-title class="pa-6 pb-4">
        <div class="d-flex flex-column flex-sm-row align-start align-sm-center ga-4 w-100">
          <div class="d-flex align-center">
            <v-icon icon="mdi-table" class="me-2" color="primary"></v-icon>
            <span class="text-h6 font-weight-medium">Cadastros</span>
          </div>
          <v-spacer class="d-none d-sm-flex"></v-spacer>
          <v-text-field v-model="search" density="comfortable" label="Buscar Nomes..." prepend-inner-icon="mdi-magnify"
            variant="outlined" hide-details single-line class="search-field" style="max-width: 300px"></v-text-field>
        </div>
      </v-card-title>

      <v-divider></v-divider>


      <v-data-table v-model:search="search" :filter-keys="['nomeCompleto']" :headers="headers" :items="cadastros"
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

        <template v-slot:item.acoes="{ item }">
          <v-btn icon="mdi-email" variant="text" color="primary" size="small" @click="abrirDialogEmail(item)"></v-btn>
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

    <v-dialog v-model="dialogEmail" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">Confirmar Envio de Email</v-card-title>
        <v-card-text>
          <div class="mb-3">
            <strong>Nome:</strong> {{ cadastroSelecionado?.nome }}
          </div>
          <div class="mb-3">
            <strong>E-mail:</strong> {{ cadastroSelecionado?.email }}
          </div>
          <div class="mb-3">
            <strong>Telefone:</strong> {{ cadastroSelecionado?.telefone }}
          </div>
          <p>Deseja enviar o email para este cadastro?</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="dialogEmail = false">Cancelar</v-btn>
          <v-btn color="primary" variant="flat" @click="enviarEmail">Enviar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>

</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import 'vue3-toastify/dist/index.css'
import 'vue3-toastify/dist/index.css'
import cadastroSimplificadoService from '@/services/cadastro-simplificado/cadastro-simplificado-service'

const search = ref('')
const cadastros = ref<any[]>([])
const loading = ref(true)
const initEffect = ref(false)
const activeTab = ref('cadastros')
const dialogEmail = ref(false)
const cadastroSelecionado = ref<any>(null)

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import 'vue3-toastify/dist/index.css'
dayjs.extend(utc)


const headers = computed(() => {
    return [
      { title: 'Nome', key: 'nome', sortable: true, align: 'center' as const },
      { title: 'E-mail', key: 'email', sortable: true, align: 'center' as const },
      { title: 'Número', key: 'telefone', sortable: true, align: 'center' as const },
      { title: 'Perfil', key: 'perfil.nome', sortable: true, align: 'center' as const },
      { title: 'Criado em', key: 'createdAt', sortable: true, align: 'center' as const },
      { title: 'Ações', key: 'acoes', sortable: false, align: 'center' as const },
    ]
  })



const buscarCadastros = async () => {
  try {
    const response = await cadastroSimplificadoService.getAllCadastroSimplificado()
    cadastros.value = Array.isArray(response.data) ? response.data : []
    causeEffectOnGraffic()

  } catch (error) {
    console.error('Erro ao carregar cadastros simplificados', error)
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
const abrirDialogEmail = (item: any) => {
  cadastroSelecionado.value = item
  dialogEmail.value = true
}

const enviarEmail = () => {
  // Função de envio será implementada
  dialogEmail.value = false
}

onMounted(async () => {
  await buscarCadastros()
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
