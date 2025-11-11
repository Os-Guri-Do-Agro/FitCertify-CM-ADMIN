<template>
  <v-container fluid class="pa-6">
    <v-row class="mb-6">
      <v-col cols="12">
        <div class="d-flex flex-column flex-sm-row justify-space-between align-start align-sm-center ga-4">
          <div class="header-content">
            <h1 class="text-h3 font-weight-bold text-primary mb-2">
              <v-icon icon="mdi-store" class="me-3" size="large"></v-icon>
              Médicos
            </h1>
            <p class="text-subtitle-1 text-medium-emphasis mb-0">
              Gerencie todos as Médicos
            </p>
          </div>

        </div>
      </v-col>
    </v-row>

    <v-row class="mb-6">
      <v-sheet class="w-100 h-100 d-flex align-center flex-column flex-md-row">


      <v-sheet class="w-100 d-flex h-100 flex-column flex-md-row">
              <v-col cols="12" sm="6" md="3">
        <v-card class="stats-card" elevation="2">
          <v-card-text class="pa-4">
            <div class="d-flex align-center">
              <v-avatar color="success" class="me-3">
                <v-icon icon="mdi-check-circle" color="white"></v-icon>
              </v-avatar>
              <div>
                <div class="text-h5 font-weight-bold">
                  {{ CountAllUsers || '0'}}
                </div>
                <div class="text-caption text-medium-emphasis">
                  Total de Médicos Ativos
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
                <div class="text-h5 font-weight-bold">{{ ContadorUsuariosInativos || '0'}}</div>
                <div class="text-caption text-medium-emphasis">
                  Total de Médicos Inativos
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      </v-sheet>

      <v-sheet>
        <v-btn @click="dialogAprovar = true" color="primary" size="large">
          <v-icon icon="mdi-account-multiple-check" class="me-2"></v-icon>
          Aprovar Médicos
        </v-btn>
      </v-sheet>
    </v-sheet>

    </v-row>

    <v-card class="main-card" elevation="3">
      <v-card-title class="pa-6 pb-4">
        <div class="d-flex flex-column flex-sm-row align-start align-sm-center ga-4 w-100">
          <div class="d-flex align-center">
            <v-icon icon="mdi-table" class="me-2" color="primary"></v-icon>
            <span class="text-h6 font-weight-medium">Lista de Médicos</span>
          </div>
          <v-spacer class="d-none d-sm-flex"></v-spacer>
          <v-text-field v-model="search" density="comfortable" label="Buscar Médicos..."
            prepend-inner-icon="mdi-magnify" variant="outlined" hide-details single-line class="search-field"
            style="max-width: 300px"></v-text-field>
        </div>
      </v-card-title>

      <v-divider></v-divider>

      <v-tabs v-model="activeTab" class="px-6">
        <v-tab value="ativos">
          <v-icon icon="mdi-check-circle" class="me-2"></v-icon>
          Médicos Ativos
        </v-tab>
        <v-tab value="inativos">
          <v-icon icon="mdi-pause-circle" class="me-2"></v-icon>
          Médicos Inativos
        </v-tab>
      </v-tabs>

      <v-divider></v-divider>

      <v-tabs-window v-model="activeTab">
        <v-tabs-window-item value="ativos">
          <v-data-table v-model:search="search" :filter-keys="['usuario.nome']" :headers="headers" :items="AllUsers"
            :loading="loading" class="custom-table" hover>
            <template v-slot:loading>
              <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
            </template>

            <template v-slot:item.ativo="{ item }">
              <v-chip :color="item.ativo ? 'success' : 'warning'"
                :prepend-icon="item.ativo ? 'mdi-check-circle' : 'mdi-pause-circle'" size="small" variant="flat">
                {{ item.ativo ? 'Ativo' : 'Inativo' }}
              </v-chip>
            </template>

            <template v-slot:item.especializacao="{ item }">
              {{ item.especializacao }}
            </template>

            <template v-slot:item.telefone="{ item }">
              {{ formatTelefone(item.telefone) }}
            </template>
            <template v-slot:item.nome="{ item }">
              {{ item.usuario.nome }}
            </template>
            <template v-slot:item.usuario.cpf="{ item }">
              {{ formatCPF(item.usuario.cpf) }}
            </template>
            <template v-slot:item.email="{ item }">
              {{ item.usuario.email }}
            </template>
            <template v-slot:item.actions="{ item }">
              <v-spacer></v-spacer>
              <div class="d-flex align-center">
                <v-btn @click="desativarMedico(item.id)" :loading="desativarMedicoLoading === item.id" icon="" size="small" rounded="xl" variant="text">
                    <v-icon icon="mdi-account-off" color="error" size="24"></v-icon>
                </v-btn>
              </div>
            </template>

            <template v-slot:no-data>
              <div class="text-center pa-8">
                <v-icon icon="mdi-check-circle" size="64" color="grey-lighten-1" class="mb-4"></v-icon>
                <div class="text-h6 text-medium-emphasis mb-2">
                  Nenhum médico ativo encontrado
                </div>
                <div class="text-body-2 text-medium-emphasis">
                  Nenhum médico ativo cadastrado no sistema
                </div>
              </div>
            </template>
          </v-data-table>
        </v-tabs-window-item>

        <v-tabs-window-item value="inativos">
          <v-data-table v-model:search="search" :filter-keys="['usuario.nome']" :headers="headerInativos" :items="medicosInativos"
            :loading="loading" class="custom-table" hover>
            <template v-slot:loading>
              <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
            </template>

            <template v-slot:item.ativo="{ item }">
              <v-chip :color="item.ativo ? 'success' : 'warning'"
                :prepend-icon="item.ativo ? 'mdi-check-circle' : 'mdi-pause-circle'" size="small" variant="flat">
                {{ item.ativo ? 'Ativo' : 'Inativo' }}
              </v-chip>
            </template>

            <template v-slot:item.especializacao="{ item }">
              {{ item.especializacao }}
            </template>

            <template v-slot:item.telefone="{ item }">
              {{ formatTelefone(item.telefone) }}
            </template>
            <template v-slot:item.nome="{ item }">
              {{ item.usuario.nome }}
            </template>
            <template v-slot:item.usuario.cpf="{ item }">
              {{ formatCPF(item.crm) }}
            </template>
            <template v-slot:item.email="{ item }">
              {{ item.usuario.email }}
            </template>
            <template v-slot:item.actions="{ item }">
              <v-spacer></v-spacer>
              <div class="d-flex align-center">
                <v-btn @click="confirmarAtivarMedico(item.id)" icon="" size="small" rounded="xl" variant="text" :loading="ativarMedicoLoading === item.id">
                    <v-icon icon="mdi-account-check" color="success" size="24"></v-icon>
                </v-btn>
              </div>
            </template>

            <template v-slot:no-data>
              <div class="text-center pa-8">
                <v-icon icon="mdi-pause-circle" size="64" color="grey-lighten-1" class="mb-4"></v-icon>
                <div class="text-h6 text-medium-emphasis mb-2">
                  Nenhum médico inativo encontrado
                </div>
                <div class="text-body-2 text-medium-emphasis">
                  Nenhum médico inativo cadastrado no sistema
                </div>
              </div>
            </template>
          </v-data-table>
        </v-tabs-window-item>
      </v-tabs-window>
    </v-card>
  </v-container>

  <v-dialog v-model="dialogAprovar" max-width="1200" persistent>
    <v-card>
      <v-card-title class="pa-6">
        <div class="d-flex align-center">
          <v-icon icon="mdi-account-multiple-check" class="me-3" color="primary"></v-icon>
          <span class="text-h5">Aprovar Médicos em Lote</span>
        </div>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pa-0">
        <v-data-table
          v-model="selectedMedicos"
          :headers="headersAprovacao"
          :items="medicosInativos"
          item-value="id"
          show-select
          class="custom-table"
        >
        <template v-slot:item.especializacao="{ item }">
              {{ item.especializacao }}
            </template>

            <template v-slot:item.telefone="{ item }">
              {{ formatTelefone(item.telefone) }}
            </template>
            <template v-slot:item.nome="{ item }">
              {{ item.usuario.nome }}
            </template>
            <template v-slot:item.usuario.cpf="{ item }">
              {{ formatCPF(item.crm) }}
            </template>
            <template v-slot:item.email="{ item }">
              {{ item.usuario.email }}
            </template>
        </v-data-table>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-6">
        <v-spacer></v-spacer>
        <v-btn @click="dialogAprovar = false" variant="outlined">
          Cancelar
        </v-btn>
        <v-btn
          @click="confirmarAtivarLote()"
          color="success"
          :disabled="selectedMedicos.length === 0"
          :loading="ativarLoteMedicosLoading"
        >
          <v-icon icon="mdi-check" class="me-2"></v-icon>
          Aprovar Selecionados ({{ selectedMedicos.length }})
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="dialogConfirmarAtivar" max-width="400" persistent>
    <v-card prepend-icon="mdi-account-check" text="Deseja ativar este médico?" title="Confirmar Ativação">
      <template v-slot:actions>
        <v-spacer></v-spacer>
        <v-btn @click="dialogConfirmarAtivar = false" variant="outlined">Cancelar</v-btn>
        <v-btn @click="confirmarAtivarMedicoAction()" color="success">Confirmar</v-btn>
      </template>
    </v-card>
  </v-dialog>

  <v-dialog v-model="dialogConfirmarLote" max-width="400" persistent>
    <v-card prepend-icon="mdi-account-multiple-check" :text="`Deseja ativar ${selectedMedicos.length} médico(s) selecionado(s)?`" title="Confirmar Ativação em Lote">
      <template v-slot:actions>
        <v-spacer></v-spacer>
        <v-btn @click="dialogConfirmarLote = false" variant="outlined">Cancelar</v-btn>
        <v-btn @click="confirmarAtivarLoteAction()" color="success">Confirmar</v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import medicosService from '@/services/medicos/medicos-service'
import { onMounted, ref } from 'vue'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const formatTelefone = (telefone: string) => {
  if (!telefone) return ''
  const cleaned = telefone.replace(/\D/g, '')
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  }
  return telefone
}
const formatCPF = (cpf: string) => {
  if (!cpf) return ''
  const cleaned = cpf.replace(/\D/g, '')
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }
  return cpf
}
// const router = useRouter()
const search = ref('')
const AllUsers = ref<any[]>([])
const medicosInativos = ref<any[]>([])
const activeTab = ref('ativos')
const loading = ref(true)
const dialog = ref(false)
const dialogAprovar = ref(false)
const dialogConfirmarAtivar = ref(false)
const dialogConfirmarLote = ref(false)
const selectedMedicos = ref<string[]>([])
const medicoParaAtivar = ref<string | null>(null)
const CountActiveUsers = ref()
const CountAllUsers = ref()
const ContadorUsuariosInativos = ref(0)
const headers = [
  { title: 'Nome', key: 'usuario.nome' },
  { title: 'CRM', key: 'crm' },
  { title: 'Município', key: 'uf' },
  { title: 'Especialização', key: 'especializacao' },
  { title: 'Ativo', key: 'ativo', },
  { title: 'Ações', key: 'actions', sortable: false, width: '150px' }
]

const ativarMedicoLoading = ref<string | null>(null)
const desativarMedicoLoading = ref<string | null>(null)
const ativarLoteMedicosLoading = ref(false)

const headerInativos = [
  { title: 'Nome', key: 'usuario.nome' },
  { title: 'CRM', key: 'crm' },
  { title: 'Município', key: 'uf' },
  { title: 'Especialização', key: 'especializacao' },
  { title: 'Ativo', key: 'ativo', },
  { title: 'Ações', key: 'actions', sortable: false, width: '150px' },
]

const headersAprovacao = [
{ title: 'Nome', key: 'usuario.nome' },
  { title: 'CRM', key: 'crm' },
  { title: 'Município', key: 'uf' },
  { title: 'Especialização', key: 'especializacao' },
  { title: 'Ativo', key: 'ativo', },
]

const confirmarAtivarMedico = (id: string) => {
  medicoParaAtivar.value = id
  dialogConfirmarAtivar.value = true
}

const confirmarAtivarMedicoAction = async () => {
  if (!medicoParaAtivar.value) return
  dialogConfirmarAtivar.value = false
  await ativarMedico(medicoParaAtivar.value)
}

const carregarDados = async () => {
  loading.value = true
  try {
    const [responseAtivos, responseInativos] = await Promise.all([
      medicosService.getAllMedicos(),
      medicosService.getAllMedicoInativos()
    ])

    CountActiveUsers.value = responseAtivos.data.filter((e: any) => e.ativo == true).length
    CountAllUsers.value = responseAtivos.data.length
    AllUsers.value = responseAtivos.data || []

    medicosInativos.value = responseInativos.data.medicosInativos || []
    ContadorUsuariosInativos.value = responseInativos.data.medicosInativos?.length
  } catch (error) {
    console.error('Erro ao carregar dados:', error)
  } finally {
    loading.value = false
  }
}

const ativarMedico = async (id: string) => {
  ativarMedicoLoading.value = id
  try {
    const data = {
      ativo: true
    }
    await medicosService.patchMedicosInativos(id, data)

    toast.success('Médico ativado com sucesso!')

    setTimeout(() => {
      carregarDados()
    }, 2000)

  } catch (error) {
    toast.error('Erro ao ativar médico!')
    console.error('Erro ao ativar médico:', error)
  } finally {
    ativarMedicoLoading.value = null
  }
}

const confirmarAtivarLote = () => {
  dialogConfirmarLote.value = true
}

const confirmarAtivarLoteAction = async () => {
  dialogConfirmarLote.value = false
  await ativarLoteMedicos(selectedMedicos.value)
}

const ativarLoteMedicos = async (ids: string[]) => {
  ativarLoteMedicosLoading.value = true
  try {
    const data = {
      ids: selectedMedicos.value,
      ativo: true
    }

    await medicosService.patchAtivarLoteMedicos(ids, data)
    toast.success('Lote de médicos ativado com sucesso!')

    setTimeout(() => {
      carregarDados()
    }, 2000)
  } catch (error) {
    toast.error('Erro ao ativar lote de médicos!')
    console.error('Erro ao ativar lote de médicos:', error)
  } finally {
    ativarLoteMedicosLoading.value = false
    dialogAprovar.value = false
  }
}

const desativarMedico = async (id: string) => {
  desativarMedicoLoading.value = id
  try {
      const data = {
    ativo: false
  }
  await medicosService.patchMedicosInativos(id, data)
  toast.success('Médico desativado com sucesso!')

    setTimeout(() => {
      carregarDados()
    }, 2000)


  } catch (error) {
    toast.error('Erro ao desativar médico!')
    console.error('Erro ao desativar médico:', error)
  } finally {
    desativarMedicoLoading.value = null
  }
}


onMounted(() => {
  carregarDados()
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
