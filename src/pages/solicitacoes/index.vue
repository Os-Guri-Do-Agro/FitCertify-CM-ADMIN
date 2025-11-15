<template>
    <v-container fluid class="pa-6">
      <!-- Header Section -->
      <v-row class="mb-6">
        <v-col cols="12">
          <div class="d-flex flex-column flex-sm-row justify-space-between align-start align-sm-center ga-4">
            <div class="header-content">
              <h1 class="text-h3 font-weight-bold text-primary mb-2">
                <v-icon icon="mdi-bank-transfer" class="me-3" size="large"></v-icon>
                Solicitações
              </h1>
              <p class="text-subtitle-1 text-medium-emphasis mb-0">
                Gerencie todas as solicitações
              </p>
            </div>

          </div>
        </v-col>
      </v-row>
  
      <v-row class="mb-6">
        <v-col cols="12" sm="6" md="3">
          <v-card class="stats-card" elevation="2">
            <v-card-text class="pa-4">
              <div class="d-flex align-center">
                <v-avatar color="primary" class="me-3">
                  <v-icon icon="mdi-file-document" color="white"></v-icon>
                </v-avatar>
                <div>
                  <div class="text-h5 font-weight-bold">
                    {{ solicitacoes?.length }}
                  </div>
                  <div class="text-caption text-medium-emphasis">
                    Total de solicitações
                  </div>
                </div>
              </div>
            </v-card-text>
            
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-card class="stats-card" elevation="2">
            <v-card-text class="pa-4">
              <div class="d-flex align-center">
                <v-avatar color="orange" class="me-3">
                  <v-icon icon="mdi-alert-circle-outline" color="white"></v-icon>
                </v-avatar>
                <div>
                  <div class="text-h5 font-weight-bold">
                    {{ solicitacoesPendentes?.length || 0 }}
                  </div>
                  <div class="text-caption text-medium-emphasis">
                    Solicitações pendentes
                  </div>
                </div>
              </div>
            </v-card-text>
            
          </v-card>
        </v-col>
      </v-row>
  
      <!-- Main Content Card -->
      <v-card class="main-card" elevation="3">
        <v-tabs v-model="activeTab" class="border-b">
          <v-tab value="todas">Todas as Solicitações</v-tab>
          <v-tab value="pendentes">Solicitações Pendentes</v-tab>
        </v-tabs>

        <v-tabs-window v-model="activeTab">
          <!-- Tab: Todas as Solicitações -->
          <v-tabs-window-item value="todas">
            <v-card-title class="pa-6 pb-4">
              <div class="d-flex flex-column flex-sm-row align-start align-sm-center ga-4 w-100">
                <div class="d-flex align-center">
                  <v-icon icon="mdi-format-list-bulleted" class="me-2" color="primary"></v-icon>
                  <span class="text-h6 font-weight-medium">Todas as Solicitações</span>
                </div>
                <v-spacer class="d-none d-sm-flex"></v-spacer>
                <v-text-field v-model="search" density="comfortable" label="Buscar Solicitações..."
                  prepend-inner-icon="mdi-magnify" variant="outlined" hide-details single-line class="search-field"
                  style="max-width: 300px"></v-text-field>
              </div>
            </v-card-title>

            <v-divider></v-divider>

            <v-data-table
              v-model:search="search"
              :headers="solicitacoesHeaders"
              :items="solicitacoes"
              :loading="loading"
              class="custom-table"
              show-expand
              expand-on-click
            >
              <template v-slot:item.valor="{ item }">
                R$ {{ item?.valorTotal?.toFixed(2) || '0,00' }}
              </template>

              <template v-slot:item.dataCriacao="{ item }">
                {{ dayjs(item.dataCriacao).format('DD/MM/YYYY HH:mm') }}
              </template>

              <template v-slot:item.dataFechamento="{ item }">
                {{ item.dataFechamento ? dayjs(item.dataFechamento).format('DD/MM/YYYY HH:mm') : '-' }}
              </template>

              <template v-slot:item.status="{ item }">
                <v-chip
                  :color="getStatusColor(item?.status)"
                  size="small"
                  variant="flat"
                >
                  {{ item?.status }}
                </v-chip>
              </template>

              <template v-slot:expanded-row="{ item }">
                <td :colspan="solicitacoesHeaders.length + 1">
                  <v-card class="ma-2" variant="outlined">
                    <v-card-text>
                      <v-row>
                        <v-col cols="12" md="6">
                          <div class="mb-2">
                            <strong>ID:</strong> {{ item.id }}
                          </div>
                          <div class="mb-2">
                            <strong>Data de Criação:</strong> {{ dayjs(item.dataCriacao).format('DD/MM/YYYY HH:mm') }}
                          </div>
                          <div class="mb-2">
                            <strong>Data de Fechamento:</strong> {{ item.dataFechamento ? dayjs(item.dataFechamento).format('DD/MM/YYYY HH:mm') : 'Não finalizada' }}
                          </div>
                          <div class="mb-2">
                            <strong>Chave PIX:</strong> {{ item.chavePix || 'Não informada' }}
                          </div>
                        </v-col>
                        <v-col cols="12" md="6">
                          <div class="mb-2">
                            <strong>Motivo:</strong>
                          </div>
                          <div class="text-body-2 pa-2 bg-grey-lighten-4 rounded">
                            {{ item.motivo || 'Nenhum motivo informado' }}
                          </div>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </td>
              </template>

              <template v-slot:no-data>
                <div class="text-center pa-8">
                  <v-icon icon="mdi-clipboard-list-outline" size="64" color="grey-lighten-1" class="mb-4"></v-icon>
                  <div class="text-h6 text-medium-emphasis mb-2">
                    Nenhuma solicitação encontrada
                  </div>
                </div>
              </template>
            </v-data-table>
          </v-tabs-window-item>

          <!-- Tab: Solicitações Pendentes -->
          <v-tabs-window-item value="pendentes">
            <v-card-title class="pa-6 pb-4">
              <div class="d-flex flex-column flex-sm-row align-start align-sm-center ga-4 w-100">
                <div class="d-flex align-center">
                  <v-icon icon="mdi-clock-outline" class="me-2" color="warning"></v-icon>
                  <span class="text-h6 font-weight-medium">Solicitações Pendentes</span>
                </div>
                <v-spacer class="d-none d-sm-flex"></v-spacer>
                <v-text-field v-model="searchPendentes" density="comfortable" label="Buscar Pendentes..."
                  prepend-inner-icon="mdi-magnify" variant="outlined" hide-details single-line class="search-field"
                  style="max-width: 300px"></v-text-field>
              </div>
            </v-card-title>

            <v-divider></v-divider>

            <v-data-table
              v-model:search="searchPendentes"
              :headers="solicitacoesPendentesHeaders"
              :items="solicitacoesPendentes"
              :loading="loading"
              class="custom-table"
              show-expand
              expand-on-click
            >
              <template v-slot:item.valor="{ item }">
                R$ {{ item?.valorTotal?.toFixed(2) || '0,00' }}
              </template>

              <template v-slot:item.dataCriacao="{ item }">
                {{ dayjs(item.dataCriacao).format('DD/MM/YYYY HH:mm') }}
              </template>

              <template v-slot:item.dataFechamento="{ item }">
                {{ item.dataFechamento ? dayjs(item.dataFechamento).format('DD/MM/YYYY HH:mm') : '-' }}
              </template>

              <template v-slot:item.status="{ item }">
                <v-chip
                  :color="getStatusColor(item?.status)"
                  size="small"
                  variant="flat"
                >
                  {{ item?.status }}
                </v-chip>
              </template>

              <template v-slot:item.actions="{ item }">
                <div class="d-flex ga-2">
                  <v-btn
                    icon="mdi-check"
                    size="small"
                    variant="text"
                    color="success"
                    @click="aprovarSolicitacao(item)"
                  ></v-btn>
                  <v-btn
                    icon="mdi-close"
                    size="small"
                    variant="text"
                    color="error"
                    @click="rejeitarSolicitacao(item)"
                  ></v-btn>
                </div>
              </template>

              <template v-slot:expanded-row="{ item }">
                <td :colspan="solicitacoesHeaders.length + 1">
                  <v-card class="ma-2" variant="outlined">
                    <v-card-text>
                      <v-row>
                        <v-col cols="12" md="6">
                          <div class="mb-2">
                            <strong>ID:</strong> {{ item.id }}
                          </div>
                          <div class="mb-2">
                            <strong>Data de Criação:</strong> {{ dayjs(item.dataCriacao).format('DD/MM/YYYY HH:mm') }}
                          </div>
                          <div class="mb-2">
                            <strong>Data de Fechamento:</strong> {{ item.dataFechamento ? dayjs(item.dataFechamento).format('DD/MM/YYYY HH:mm') : 'Não finalizada' }}
                          </div>
                          <div class="mb-2">
                            <strong>Chave PIX:</strong> {{ item.chavePix || 'Não informada' }}
                          </div>
                        </v-col>
                        <v-col cols="12" md="6">
                          <div class="mb-2">
                            <strong>Motivo:</strong>
                          </div>
                          <div class="text-body-2 pa-2 bg-grey-lighten-4 rounded">
                            {{ item.motivo || 'Nenhum motivo informado' }}
                          </div>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </td>
              </template>

              <template v-slot:no-data>
                <div class="text-center pa-8">
                  <v-icon icon="mdi-clock-alert-outline" size="64" color="grey-lighten-1" class="mb-4"></v-icon>
                  <div class="text-h6 text-medium-emphasis mb-2">
                    Nenhuma solicitação pendente
                  </div>
                </div>
              </template>
            </v-data-table>
          </v-tabs-window-item>
        </v-tabs-window>
      </v-card>
    </v-container>

    <!-- Dialog Aprovar Solicitação -->
    <v-dialog v-model="dialogAprovar" max-width="400" persistent>
      <v-card prepend-icon="mdi-check-circle" title="Aprovar Solicitação">
        <v-card-text>
          Deseja aprovar esta solicitação de saque?
        </v-card-text>
        <template v-slot:actions>
          <v-spacer></v-spacer>
          <v-btn @click="dialogAprovar = false">Cancelar</v-btn>
          <v-btn @click="confirmarAprovar" color="success" :loading="loadingAprovar" :disabled="loadingAprovar">Aprovar</v-btn>
        </template>
      </v-card>
    </v-dialog>

    <!-- Dialog rejeitar Solicitação -->
    <v-dialog v-model="dialogrejeitar" max-width="500" persistent>
      <v-card prepend-icon="mdi-close-circle" title="rejeitar Solicitação">
        <v-card-text>
          <p class="mb-4">Deseja rejeitar esta solicitação de saque?</p>
          <v-text-field
            v-model="motivoRecusa"
            label="Motivo da recusa *"
            variant="outlined"
            placeholder="Informe o motivo da recusa..."
            required
          ></v-text-field>
        </v-card-text>
        <template v-slot:actions>
          <v-spacer></v-spacer>
          <v-btn @click="dialogrejeitar = false; motivoRecusa = ''">Cancelar</v-btn>
          <v-btn @click="confirmarRejeitar" color="error" :loading="loadingrejeitar" :disabled="loadingrejeitar">rejeitar</v-btn>
        </template>
      </v-card>
    </v-dialog>
  </template>
  
  <script setup lang="ts">
  import cupomService from '@/services/cupom/cupom-service'
  import { computed, onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { toast } from 'vue3-toastify'
  import 'vue3-toastify/dist/index.css'
  const router = useRouter()
  const search = ref('')
  const searchPendentes = ref('')
  const activeTab = ref('todas')
  const loading = ref(true)
  const loadingAprovar = ref(false)
  const loadingrejeitar = ref(false)
  const dialog = ref(false)
  const dialogAprovar = ref(false)
  const dialogrejeitar = ref(false)
  const selectedSolicitacao = ref<any | null>(null)
  const motivoRecusa = ref('')

  const solicitacoes = ref<any[]>([])
  
  const solicitacoesPendentes = computed(() => 
    solicitacoes.value.filter(s => s.status === 'PENDENTE')
  )
  
  const solicitacoesHeaders = [
    { title: 'Usuário', key: 'createdBy', sortable: true },
    { title: 'Valor', key: 'valor', sortable: true, align: 'center' as const },
    { title: 'Data Criação', key: 'dataCriacao', sortable: true, align: 'center' as const },
    { title: 'Data Fechamento', key: 'dataFechamento', sortable: true, align: 'center' as const },
    { title: 'Status', key: 'status', sortable: true, align: 'center' as const }
  ]

  const solicitacoesPendentesHeaders = [
    { title: 'Usuário', key: 'createdBy', sortable: true },
    { title: 'Valor', key: 'valor', sortable: true, align: 'center' as const },
    { title: 'Data Criação', key: 'dataCriacao', sortable: true, align: 'center' as const },
    { title: 'Data Fechamento', key: 'dataFechamento', sortable: true, align: 'center' as const },
    { title: 'Status', key: 'status', sortable: true, align: 'center' as const },
    { title: 'Ações', key: 'actions', sortable: false, align: 'center' as const, width: '150px' }
  ]

  const buscarSolicitacoes = async () => {
    try {
        const response = await cupomService.getAllSolicitacoes();
        solicitacoes.value = response.data;
    } catch (error) {
        console.error('Erro ao buscar solicitações:', error);
    } finally {
        loading.value = false
    }
  }
  

  import dayjs from 'dayjs'
  import utc from 'dayjs/plugin/utc'
  import 'vue3-toastify/dist/index.css'
  dayjs.extend(utc)

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pendente': return 'warning'
      case 'aprovado': return 'success'
      case 'rejeitado': return 'error'
      case 'em_analise': return 'info'
      default: return 'grey'
    }
  }

  const aprovarSolicitacao = (item: any) => {
    selectedSolicitacao.value = item
    dialogAprovar.value = true
  }

  const rejeitarSolicitacao = (item: any) => {
    selectedSolicitacao.value = item
    dialogrejeitar.value = true
  }

  const confirmarAprovar = async () => {
    loadingAprovar.value = true
    try {
        const id = selectedSolicitacao.value?.id
        await cupomService.aprovarSolicitacao(id)
        toast.success('Solicitação aprovada com sucesso!')
    } catch (error) {
        toast.error('Erro ao aprovar solicitação')
        console.error('Erro ao aprovar solicitação:', error)
    } finally {
        loadingAprovar.value = false
        dialogAprovar.value = false
        selectedSolicitacao.value = null
        await buscarSolicitacoes()
    }
  }

  const confirmarRejeitar = async () => {
    if (!motivoRecusa.value.trim()) {
      toast.error('Motivo da recusa é obrigatório')
      return
    }
    loadingrejeitar.value = true
    try {
        const id = selectedSolicitacao.value?.id
        const data = {
            motivo: motivoRecusa.value
        }
        await cupomService.rejeitarSolicitacao(id, data)
        toast.success('Solicitação rejeitada com sucesso!')
    } catch (error) {
        toast.error('Erro ao rejeitar solicitação')
        console.error('Erro ao rejeitar solicitação:', error)
    } finally {
        loadingrejeitar.value = false
        dialogrejeitar.value = false
        selectedSolicitacao.value = null
        motivoRecusa.value = ''
        await buscarSolicitacoes()
    }
  }
  
  onMounted(async () => {
    await buscarSolicitacoes()
  })
  </script>
  
  <style scoped>
  .header-content {
    flex: 1;
  }
  
  .create-btn {
    transition: all 0.3s ease;
  }
  
  .create-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  .stats-card {
    transition: all 0.3s ease;
    border-radius: 12px;
  }
  
  .stats-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
  
  .main-card {
    border-radius: 16px;
    overflow: hidden;
  }
  
  .search-field {
    transition: all 0.3s ease;
  }
  
  .custom-table {
    border-radius: 0;
  }
  
  .custom-table :deep(.v-data-table__tr:hover) {
    background-color: rgba(var(--v-theme-primary), 0.05);
  }
  
  .article-title {
    max-width: 150px;
  }
  
  @media (max-width: 600px) {
    .header-content h1 {
      font-size: 1.75rem !important;
    }
  
    .stats-card {
      margin-bottom: 1rem;
    }
  }
  </style>
  