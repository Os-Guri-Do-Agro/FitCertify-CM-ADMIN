<template>
  <v-container fluid class="pa-6">
    <!-- Header Section -->
    <v-row class="mb-6">
      <v-col cols="12">
        <div
          class="d-flex flex-column flex-sm-row justify-space-between align-start align-sm-center ga-4"
        >
          <div class="header-content">
            <h1 class="text-h3 font-weight-bold text-primary mb-2">
              <v-icon icon="mdi-store" class="me-3" size="large"></v-icon>
              Eventos
            </h1>
            <p class="text-subtitle-1 text-medium-emphasis mb-0">
              Gerencie todas os Eventos
            </p>
          </div>
          <div class="d-flex flex-column ga-2">
            <router-link :to="{ path: '/evento/form' }">
              <v-btn
                color="primary"
                size="large"
                prepend-icon="mdi-plus"
                class="create-btn"
                elevation="2"
              >
                Criar Evento
              </v-btn>
            </router-link>
            <router-link :to="{ path: '/evento/organizacao/form' }">
            </router-link>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- Stats Cards -->
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
                  {{ evento?.length || 0 }}
                </div>
                <div class="text-caption text-medium-emphasis">
                  Total de Eventos
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
              <v-avatar color="success" class="me-3">
                <v-icon icon="mdi-check-circle" color="white"></v-icon>
              </v-avatar>
              <div>
                <div class="text-h5 font-weight-bold">{{ activeCount }}</div>
                <div class="text-caption text-medium-emphasis">
                  Eventos Ativos
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Organizations Section -->
    <v-card class="mb-6 main-card" elevation="2">
      <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-title>
            <div class="d-flex align-center justify-space-between w-100">
              <div class="d-flex align-center">
              <v-icon icon="mdi-domain" class="me-2" color="primary"></v-icon>
              <span class="text-h6 font-weight-medium">Organizações de Eventos</span>
              <v-spacer></v-spacer>
              <v-chip class="ml-2" size="small" color="primary" variant="flat">
                {{ organizacoes.length }} organizações
              </v-chip>
              </div>


              <v-btn class="mx-2" prepend-icon="mdi-plus" color="primary" rounded="xl" variant="outlined" @click="criarOrganizacao()">Adicionar</v-btn>

            </div>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-data-table
              :headers="organizationHeaders"
              :items="organizacoes"
              :loading="loadingOrganizacoes"
              class="custom-table"
              hover
            >
              <!-- Loading -->
              <template v-slot:loading>
                <v-skeleton-loader type="table-row@5"></v-skeleton-loader>
              </template>
              <!-- Logo -->
              <template v-slot:item.logoUrl="{ item }">
                <v-avatar size="32" class="me-3">
                  <v-img :src="item.logoUrl" alt="logo organização" cover>
                    <template v-slot:error>
                      <v-icon icon="mdi-domain" size="16"></v-icon>
                    </template>
                  </v-img>
                </v-avatar>
              </template>
              <!-- Nome -->
              <template v-slot:item.nome="{ item }">
                <div class="d-flex align-center">
                  <span class="font-weight-medium">{{ item.nome }}</span>
                </div>
              </template>

              <!-- Actions -->
              <template v-slot:item.actions="{ item }">
                <div class="d-flex ga-2">
                  <v-btn
                    icon="mdi-pencil"
                    size="small"
                    variant="text"
                    color="warning"
                    @click="editOrganizacao(item)"
                  ></v-btn>
                  <v-btn
                    icon="mdi-delete"
                    size="small"
                    variant="text"
                    color="error"
                    @click="deleteOrganizacao(item)"
                  ></v-btn>
                </div>
              </template>

              <!-- No data -->
              <template v-slot:no-data>
                <div class="text-center pa-8">
                  <v-icon icon="mdi-domain-outline" size="64" color="grey-lighten-1" class="mb-4"></v-icon>
                  <div class="text-h6 text-medium-emphasis mb-2">
                    Nenhuma organização encontrada
                  </div>
                  <div class="text-body-2 text-medium-emphasis">
                    As organizações aparecerão aqui
                  </div>
                </div>
              </template>
            </v-data-table>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card>

        <!-- Tipo Evento Section -->
        <v-card class="mb-6 main-card" elevation="2">
      <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-title>
            <div class="d-flex align-center justify-space-between w-100">
              <div class="d-flex align-center">
              <v-icon icon="mdi-view-list-outline" class="me-2" color="primary"></v-icon>
              <span class="text-h6 font-weight-medium">Tipos de eventos</span>
              <v-spacer></v-spacer>
              <v-chip class="ml-2" size="small" color="primary" variant="flat">
                {{ tiposEvento.length }} Tipos
              </v-chip>
              </div>


              <v-btn class="mx-2" prepend-icon="mdi-plus" color="primary" rounded="xl" variant="outlined" @click.stop="createTipoEventoDialog = true">Adicionar</v-btn>
            </div>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-data-table
              :headers="tiposEventoHeaders"
              :items="tiposEvento"
              :loading="loadingTipoEvento"
              class="custom-table"
              hover
            >
              <!-- Loading -->
              <template v-slot:loading>
                <v-skeleton-loader type="table-row@5"></v-skeleton-loader>
              </template>

              <template v-slot:item.nome="{ item }">
                <div class="d-flex align-center">
                  <span class="font-weight-medium">{{ item.nome }}</span>
                </div>
              </template>

              <!-- Actions -->
              <template v-slot:item.actions="{ item }">
                <div class="d-flex ga-2">
                  <v-btn
                    icon="mdi-pencil"
                    size="small"
                    variant="text"
                    color="warning"
                    @click="openEditTipoEvento(item)"
                  ></v-btn>
                  <v-btn
                    icon="mdi-delete"
                    size="small"
                    variant="text"
                    color="error"
                    @click="deleteTipoEvento(item)"
                  ></v-btn>
                </div>
              </template>

              <!-- No data -->
              <template v-slot:no-data>
                <div class="text-center pa-8">
                  <v-icon icon="mdi-domain-outline" size="64" color="grey-lighten-1" class="mb-4"></v-icon>
                  <div class="text-h6 text-medium-emphasis mb-2">
                    Nenhuma organização encontrada
                  </div>
                  <div class="text-body-2 text-medium-emphasis">
                    As organizações aparecerão aqui
                  </div>
                </div>
              </template>
            </v-data-table>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card>

    <!-- Main Content Card -->
    <v-card class="main-card" elevation="3">
      <!-- Search Header -->
      <v-card-title class="pa-6 pb-4">
        <div
          class="d-flex flex-column flex-sm-row align-start align-sm-center ga-4 w-100"
        >
          <div class="d-flex align-center">
            <v-icon icon="mdi-table" class="me-2" color="primary"></v-icon>
            <span class="text-h6 font-weight-medium">Lista de Eventos</span>
          </div>
          <v-spacer class="d-none d-sm-flex"></v-spacer>
          <v-text-field
            v-model="search"
            density="comfortable"
            label="Buscar Eventos..."
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            hide-details
            single-line
            class="search-field"
            style="max-width: 300px"
          ></v-text-field>
        </div>
      </v-card-title>

      <v-divider></v-divider>

      <!-- Data Table -->
      <v-data-table
        v-model:search="search"
        :filter-keys="['titulo']"
        :headers="headers"
        :items="evento"
        :loading="loading"
        class="custom-table"
        hover
      >
        <!-- Loading -->
        <template v-slot:loading>
          <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
        </template>

        <!-- Foto -->
        <template v-slot:item.imagemUrl="{ item }">
          <v-avatar size="48" class="ma-2">
            <v-img :src="item.imagemUrl" alt="foto evento" cover>
              <template v-slot:error>
                <v-icon icon="mdi-image-broken" size="24"></v-icon>
              </template>
            </v-img>
          </v-avatar>
        </template>

        <template v-slot:item.data="{ item }">
          <p>{{ dayjs(item.data).utc().format('DD/MM/YYYY') }}</p>
        </template>

        <template v-slot:item.ativo="{ item }">
          <v-chip
            :color="item.ativo ? 'success' : 'warning'"
            :prepend-icon="item.ativo ? 'mdi-check-circle' : 'mdi-pause-circle'"
            size="small"
            variant="flat"
          >
            {{ item.ativo ? 'Ativo' : 'Inativo' }}
          </v-chip>
        </template>

        <!-- Actions -->
        <template v-slot:item.actions="{ item }">
          <div class="d-flex ga-2">
            <v-btn
              icon="mdi-pencil"
              size="small"
              variant="text"
              color="warning"
              @click="editEvento(item.id)"
            ></v-btn>
            <v-btn
              icon="mdi-delete"
              size="small"
              variant="text"
              color="error"
              @click="deleteEvento(item)"
            ></v-btn>
          </div>
        </template>

        <!-- No data -->
        <template v-slot:no-data>
          <div class="text-center pa-8">
            <v-icon
              icon="mdi-newspaper-variant-outline"
              size="64"
              color="grey-lighten-1"
              class="mb-4"
            ></v-icon>
            <div class="text-h6 text-medium-emphasis mb-2">
              Nenhum evento encontrado
            </div>
            <div class="text-body-2 text-medium-emphasis">
              Comece criando seu primeiro Evento
            </div>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </v-container>

  <v-dialog v-model="dialog" max-width="400" persistent>
    <v-card
      prepend-icon="mdi-post-outline"
      text="Deseja excluir este evento?"
      title="Confirmação de Exclusão"
    >
      <template v-slot:actions>
        <v-spacer></v-spacer>

        <v-btn @click="dialog = false"> recusar </v-btn>

        <v-btn @click="confirmDelete" color="primary" :loading="loadingDelete"> confirmar </v-btn>
      </template>
    </v-card>
  </v-dialog>

  <!-- Dialog Exclusão Organização -->
  <v-dialog v-model="organizacaoDialog" max-width="400" persistent>
    <v-card
      prepend-icon="mdi-domain-outline"
      text="Deseja excluir esta organização?"
      title="Confirmação de Exclusão"
    >
      <template v-slot:actions>
        <v-spacer></v-spacer>
        <v-btn @click="organizacaoDialog = false">recusar</v-btn>
        <v-btn @click="confirmDeleteOrganizacao" color="primary" :loading="loadingDelete">
          confirmar
        </v-btn>
      </template>
    </v-card>
  </v-dialog>

  <!-- Dialog Criar Tipo Evento -->
  <v-dialog v-model="createTipoEventoDialog" max-width="500" persistent>
    <v-card title="Criar Tipo Evento" prepend-icon="mdi-plus">
      <v-card-text>
        <v-text-field
          v-model="formTipoEvento.nome"
          label="Nome"
          variant="outlined"
          required
        ></v-text-field>
        <v-text-field
          v-model="formTipoEvento.en_nome"
          label="Name (en)"
          variant="outlined"
          required
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="createTipoEventoDialog = false">Cancelar</v-btn>
        <v-btn @click="createTipoEvento" color="primary" :loading="loadingTipoEvento">
          Criar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Dialog Editar Tipo Evento -->
  <v-dialog v-model="editTipoEventoDialog" max-width="500" persistent>
    <v-card title="Editar Tipo Evento" prepend-icon="mdi-pencil">
      <v-card-text>
        <v-text-field
          v-model="formTipoEvento.nome"
          label="Nome"
          variant="outlined"
          required
        ></v-text-field>
        <v-text-field
          v-model="formTipoEvento.en_nome"
          label="Name (en)"
          variant="outlined"
          required
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="editTipoEventoDialog = false">Cancelar</v-btn>
        <v-btn @click="editTipoEvento" color="primary" :loading="loadingTipoEvento">
          Salvar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Dialog Excluir Tipo Evento -->
  <v-dialog v-model="deleteTipoEventoDialog" max-width="400" persistent>
    <v-card
      prepend-icon="mdi-shape-outline"
      text="Deseja excluir este tipo de evento?"
      title="Confirmação de Exclusão"
    >
      <template v-slot:actions>
        <v-spacer></v-spacer>
        <v-btn @click="deleteTipoEventoDialog = false">recusar</v-btn>
        <v-btn @click="confirmDeleteTipoEvento" color="primary" :loading="loadingDelete">
          confirmar
        </v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import eventoService from '@/services/evento/evento-service'
import organizacaoService from '@/services/organizacao-evento/organizacao-evento-service'
import tipoEventoService from '@/services/tipo-evento/tipo-evento-service'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import 'vue3-toastify/dist/index.css'

dayjs.extend(utc)
const router = useRouter()
const formTipoEvento = ref({
  nome: '',
  en_nome: '',
  ativo: true,
  id: null as number | null,
})
const search = ref('')
const evento = ref<any[]>([])
const organizacoes = ref<any[]>([])
const loading = ref(true)
const loadingOrganizacoes = ref(true)
const loadingDelete = ref(false)
const loadingTipoEvento = ref(false)
const selectedEvento = ref<any | null>(null)
const selectedOrganizacao = ref<any | null>(null)
const selectedTipoEvento = ref<any | null>(null)
const dialog = ref(false)
const organizacaoDialog = ref(false)
const deleteTipoEventoDialog = ref(false)
const createTipoEventoDialog = ref(false)
const editTipoEventoDialog = ref(false)
const tiposEvento = ref<any[]>([])
const headers = [
  { title: 'Imagem', key: 'imagemUrl', sortable: false, width: '100px' },
  { title: 'Titulo', key: 'titulo', align: 'center' as const },
  { title: 'Local', key: 'local', align: 'center' as const },
  { title: 'Data', key: 'data', align: 'center' as const },
  { title: 'Status', key: 'ativo', sortable: true },
  { title: 'Ações', key: 'actions', sortable: false, width: '150px' },
]

const organizationHeaders = [
  { title: 'Logo', key: 'logoUrl', sortable: false, width: '80px' },
  { title: 'Nome', key: 'nome', sortable: true },
  { title: 'Ações', key: 'actions', sortable: false, width: '100px' },
]

const tiposEventoHeaders = [
  { title: 'Nome', key: 'nome', sortable: true },
  { title: 'Name (en)', key: 'en_nome', sortable: true },
  { title: 'Criador', key: 'createdBy', sortable: true },
  { title: 'Ações', key: 'actions', sortable: false, width: '100px' },
]

// Computed stats
const activeCount = computed(
  () => evento.value?.filter((evento) => evento.ativo).length || 0
)

// Actions

const openCreateTipoEvento = () => {
  formTipoEvento.value = { nome: '', en_nome: '', ativo: true, id: null }
  createTipoEventoDialog.value = true
}

const openEditTipoEvento = (item: any) => {
  formTipoEvento.value = { nome: item.nome, en_nome: item.en_nome || '', ativo: item.ativo ?? true, id: item.id }
  editTipoEventoDialog.value = true
}

const createTipoEvento = async () => {
  const data = {
    nome: formTipoEvento.value.nome,
    en_nome: formTipoEvento.value.en_nome,
    ativo: formTipoEvento.value.ativo,
  }
  try {
    await tipoEventoService.createTipoEvento(data)
  } catch (error) {
    console.error('Erro ao criar tipo evento:', error)
    toast.error('Erro ao criar tipo evento')
  } finally {
    // Recarregar tipos de evento da API
    const tiposResponse = await tipoEventoService.getAllTipoEventos()
    tiposEvento.value = Array.isArray(tiposResponse.data) ? tiposResponse.data : []

    toast.success('Tipo evento criado com sucesso!')
    createTipoEventoDialog.value = false
    formTipoEvento.value = { nome: '', en_nome: '', ativo: true, id: null }
  }
}

const editTipoEvento = async () => {
  if (!formTipoEvento.value.id) return

  loadingTipoEvento.value = true
  try {
    await tipoEventoService.editTipoEvento(formTipoEvento.value.id, {
      nome: formTipoEvento.value.nome,
      en_nome: formTipoEvento.value.en_nome,
      ativo: true
    })

    // Recarregar tipos de evento da API
    const tiposResponse = await tipoEventoService.getAllTipoEventos()
    tiposEvento.value = Array.isArray(tiposResponse.data) ? tiposResponse.data : []

    toast.success('Tipo evento editado com sucesso!')
  } catch (error) {
    console.error('Erro ao editar tipo evento:', error)
    toast.error('Erro ao editar tipo evento')
  } finally {
    loadingTipoEvento.value = false
    editTipoEventoDialog.value = false
    formTipoEvento.value = { nome: '', en_nome: '', ativo: true, id: null }
  }
}

const deleteTipoEvento = (item: any) => {
  selectedTipoEvento.value = item
  deleteTipoEventoDialog.value = true
}

const editEvento = (id: any) => {
  ;(window as any).editingEventoId = id
  router.push('/evento/editForm')
}

const deleteEvento = (item: any) => {
  selectedEvento.value = item
  dialog.value = true
}

const editOrganizacao = (item: any) => {
  (window as any).editingOrganizacaoId = item.id
  router.push('/evento/organizacao/editForm')
}

const deleteOrganizacao = (item: any) => {
  selectedOrganizacao.value = item
  organizacaoDialog.value = true
}

const criarOrganizacao = () => {
  router.push('/evento/organizacao/Form')
}

const confirmDeleteOrganizacao = async () => {
  if (!selectedOrganizacao.value) return

  loadingDelete.value = true
  try {
    await organizacaoService.deleteOrganizacao(selectedOrganizacao.value.id)
    organizacoes.value = organizacoes.value.filter(o => o.id !== selectedOrganizacao.value?.id)
    toast.success('Organização excluída com sucesso!')
  } catch (error) {
    console.error('Erro ao excluir organização:', error)
    toast.error('Erro ao excluir organização')
  } finally {
    loadingDelete.value = false
    organizacaoDialog.value = false
    selectedOrganizacao.value = null
  }
}

const confirmDeleteTipoEvento = async () => {
  if (!selectedTipoEvento.value) return

  loadingDelete.value = true
  try {
    await tipoEventoService.deleteTipoEvento(selectedTipoEvento.value.id)
    tiposEvento.value = tiposEvento.value.filter(t => t.id !== selectedTipoEvento.value?.id)
    toast.success('Tipo evento excluído com sucesso!')
  } catch (error) {
    console.error('Erro ao excluir tipo evento:', error)
    toast.error('Erro ao excluir tipo evento')
  } finally {
    loadingDelete.value = false
    deleteTipoEventoDialog.value = false
    selectedTipoEvento.value = null
  }
}

const confirmDelete = async () => {
  loadingDelete.value = true
  if (!selectedEvento.value) return

  try {
    await eventoService.deleteEvento(selectedEvento.value.id)
    evento.value = evento.value.filter((a) => a.id !== selectedEvento.value?.id)
    toast.success('Evento excluído com sucesso!')
  } catch (error) {
    toast.error('Erro ao excluir Evento')
    console.error('Erro ao excluir Empresa:', error)
  } finally {
    loadingDelete.value = false
    dialog.value = false
    selectedEvento.value = null
  }
}

onMounted(async () => {
  try {
    // Carregar eventos
    const response = await eventoService.getAllEventosAuto()
    evento.value = Array.isArray(response.data) ? response.data : []

    // Carregar tipos de evento
    const tiposResponse = await tipoEventoService.getAllTipoEventos()
    tiposEvento.value = Array.isArray(tiposResponse.data) ? tiposResponse.data : []

    // Carregar organizações
    const orgResponse = await organizacaoService.getAllOrganizacoesAuto()
    organizacoes.value = Array.isArray(orgResponse.data) ? orgResponse.data : []
  } catch (error) {
    console.error('Erro ao carregar dados:', error)
  } finally {
    loading.value = false
    loadingOrganizacoes.value = false
  }
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
