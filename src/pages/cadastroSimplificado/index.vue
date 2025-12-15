<template>
  <v-container fluid class="pa-6">

    <div class="d-flex justify-space-between align-center flex-wrap">
      <div class="">
            <h1 class="text-h3 font-weight-bold text-primary mb-2">
              <v-icon icon="mdi-format-list-group" class="me-3" size="large"></v-icon>
              Cadastros Simplificados
            </h1>
            <p class="text-subtitle-1 text-medium-emphasis mb-0">
              Gerencie todos os cadastros simplificados
            </p>
      </div>

      <div  class="text-center mt-5 mt-md-0">
        <v-btn @click="dialogEnviarEmails = true" color="primary" size="large">
          <v-icon icon="mdi-email-multiple" class="me-2"></v-icon>
          Enviar Emails
        </v-btn>
      </div>
    </div>


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


      <v-data-table v-model:search="search" :filter-keys="['nome', 'email', 'telefone']" :headers="headers" :items="cadastros"
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
          <v-btn color="primary" variant="flat" @click="enviarEmail" :loading="enviarEmailLoading">Enviar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogEnviarEmails" max-width="1200" persistent>
      <v-card>
        <v-card-title class="pa-6">
          <div class="d-flex align-center">
            <v-icon icon="mdi-email-multiple" class="me-3" color="primary"></v-icon>
            <span class="text-h5">Enviar Emails em Lote</span>
          </div>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="pa-0">
          <v-data-table
            v-model="selectedCadastros"
            :headers="headersEnvioEmails"
            :items="cadastros"
            item-value="id"
            show-select
            class="custom-table"
          >
            <template v-slot:item.createdAt="{ item }">
              {{ dayjs(item.createdAt).utcOffset('0').format('DD/MM/YYYY') }}
            </template>
          </v-data-table>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-6">
          <v-spacer></v-spacer>
          <v-btn @click="dialogEnviarEmails = false" variant="outlined">
            Cancelar
          </v-btn>
          <v-btn
            @click="confirmarEnvioLote()"
            color="primary"
            :disabled="selectedCadastros.length === 0"
            :loading="enviarEmailsLoteLoading"
          >
            <v-icon icon="mdi-email-send" class="me-2"></v-icon>
            Enviar para Selecionados ({{ selectedCadastros.length }})
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogConfirmarEnvioLote" max-width="400" persistent>
      <v-card prepend-icon="mdi-email-multiple" :text="`Deseja enviar emails para ${selectedCadastros.length} cadastro(s) selecionado(s)?`" title="Confirmar Envio em Lote">
        <template v-slot:actions>
          <v-spacer></v-spacer>
          <v-btn @click="dialogConfirmarEnvioLote = false" variant="outlined">Cancelar</v-btn>
          <v-btn @click="confirmarEnvioLoteAction()" color="primary" :loading="enviarEmailsLoteLoading">Confirmar</v-btn>
        </template>
      </v-card>
    </v-dialog>
  </v-container>

</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import cadastroSimplificadoService from '@/services/cadastro-simplificado/cadastro-simplificado-service'

const search = ref('')
const cadastros = ref<any[]>([])
const loading = ref(true)
const initEffect = ref(false)
const activeTab = ref('cadastros')
const dialogEmail = ref(false)
const dialogEnviarEmails = ref(false)
const dialogConfirmarEnvioLote = ref(false)
const selectedCadastros = ref<string[]>([])
const cadastroSelecionado = ref<any>(null)
const enviarEmailsLoteLoading = ref(false)
const enviarEmailLoading = ref(false)

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

const headersEnvioEmails = computed(() => {
    return [
      { title: 'Nome', key: 'nome', sortable: true, align: 'center' as const },
      { title: 'E-mail', key: 'email', sortable: true, align: 'center' as const },
      { title: 'Telefone', key: 'telefone', sortable: true, align: 'center' as const },
      { title: 'Perfil', key: 'perfil.nome', sortable: true, align: 'center' as const },
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

const enviarEmail = async () => {
  enviarEmailLoading.value = true
  try {
    const data = {
      cadastros: [{
        id: cadastroSelecionado.value.id,
        nome: cadastroSelecionado.value.nome,
        email: cadastroSelecionado.value.email,
        telefone: cadastroSelecionado.value.telefone,
        perfilId: cadastroSelecionado.value.perfilId,
      }]
    }

    await cadastroSimplificadoService.enviarEmail(data)
    toast.success('Email enviado com sucesso!')
  } catch (error) {
    console.error('Erro ao enviar email', error)
    toast.error('Erro ao enviar email!')
  } finally {
    enviarEmailLoading.value = false
    dialogEmail.value = false
  }
}

const confirmarEnvioLote = () => {
  dialogConfirmarEnvioLote.value = true
}

const confirmarEnvioLoteAction = async () => {
  dialogConfirmarEnvioLote.value = false
  await enviarEmailsLote(selectedCadastros.value)
}

const enviarEmailsLote = async (ids: string[]) => {
  enviarEmailsLoteLoading.value = true
  try {
    const cadastrosSelecionados = cadastros.value.filter(c => ids.includes(c.id))
    await cadastroSimplificadoService.enviarEmail({ cadastros: cadastrosSelecionados })
    toast.success('Emails enviados com sucesso!')
  } catch (error) {
    console.error('Erro ao enviar emails em lote:', error)
    toast.error('Erro ao enviar emails em lote!')
  } finally {
    enviarEmailsLoteLoading.value = false
    dialogEnviarEmails.value = false
    selectedCadastros.value = []
  }
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
