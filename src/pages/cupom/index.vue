<template>
  <v-container fluid class="pa-6">
    <!-- Header Section -->
    <v-row class="mb-6">
      <v-col cols="12">
        <div class="d-flex flex-column flex-sm-row justify-space-between align-start align-sm-center ga-4">
          <div class="header-content">
            <h1 class="text-h3 font-weight-bold text-primary mb-2">
              <v-icon icon="mdi-ticket-percent" class="me-3" size="large"></v-icon>
              Cupons
            </h1>
            <p class="text-subtitle-1 text-medium-emphasis mb-0">
              Gerencie todas os Cupons
            </p>
          </div>
          <v-btn @click="showModalCreateQRCODE = true" color="primary" size="large" prepend-icon="mdi-plus"
            class="create-btn" elevation="2">
            Criar Cupom
          </v-btn>
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
                  {{ cupons?.length || 0 }}
                </div>
                <div class="text-caption text-medium-emphasis">
                  Total de Cupons
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Main Content Card -->
    <v-card class="main-card" elevation="3">
      <!-- Search Header -->
      <v-card-title class="pa-6 pb-4">
        <div class="d-flex flex-column flex-sm-row align-start align-sm-center ga-4 w-100">
          <div class="d-flex align-center">
            <v-icon icon="mdi-table" class="me-2" color="primary"></v-icon>
            <span class="text-h6 font-weight-medium">Lista de Produtos</span>
          </div>
          <v-spacer class="d-none d-sm-flex"></v-spacer>
          <v-text-field v-model="search" density="comfortable" label="Buscar Produtos..."
            prepend-inner-icon="mdi-magnify" variant="outlined" hide-details single-line class="search-field"
            style="max-width: 300px"></v-text-field>
        </div>
      </v-card-title>

      <v-divider></v-divider>

      <!-- Data Table -->
      <v-data-table v-model:search="search" :filter-keys="['titulo']" :headers="headers" :items="cupons"
        :loading="loading" class="custom-table" hover>
        <!-- Loading -->
        <template v-slot:loading>
          <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
        </template>


        <template v-slot:item.validade="{ item }">
          {{ dayjs(item.validade).utcOffset('0').format('DD/MM/YYYY') }}
        </template>

        <template v-slot:item.diasTrial="{ item }">
          {{ item.diasTrial ? `${item.diasTrial} dias` : '-' }}
        </template>

        <template v-slot:item.limiteMaximoDeUso="{ item }">
          {{ item.limiteMaximoDeUso == null ? 'Ilimitado' : item.limiteMaximoDeUso }}
        </template>


        <template v-slot:item.ativo="{ item }">
          <v-chip :color="item.ativo ? 'success' : 'warning'"
            :prepend-icon="item.ativo ? 'mdi-check-circle' : 'mdi-pause-circle'" size="small" variant="flat">
            {{ item.ativo ? 'Ativo' : 'Inativo' }}
          </v-chip>
        </template>

        <!-- Actions -->
        <template v-slot:item.actions="{ item }">
          <div class="d-flex ga-2">
            <v-btn icon="mdi-close" size="small" variant="text" color="red" @click="deleteCupom(item.id)"></v-btn>
          </div>
        </template>

        <!-- No data -->
        <template v-slot:no-data>
          <div class="text-center pa-8">
            <v-icon icon="mdi-newspaper-variant-outline" size="64" color="grey-lighten-1" class="mb-4"></v-icon>
            <div class="text-h6 text-medium-emphasis mb-2">
              Nenhum cupom encontrado
            </div>
            <div class="text-body-2 text-medium-emphasis">
              Comece criando sua primeira Cupom
            </div>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
  <v-dialog v-model="showModalCreateQRCODE" max-width="500" persistent>
    <v-card class="pa-4">
      <v-card-title class="text-h5 mb-4 d-flex align-center">
        <v-icon icon="mdi-ticket-percent" class="me-3" color="primary"></v-icon>
        Criar Novo Cupom
      </v-card-title>

      <v-form ref="formRef">
        <v-select v-model="cupomForm.tipo" label="Tipo de Cupom" :items="tiposCupom" variant="outlined" class="mb-3"
          :rules="[rules.required]"></v-select>

        <v-text-field v-model="cupomForm.codigo" label="Código do Cupom" placeholder="Ex: DESCONTO10" variant="outlined"
          class="mb-3" maxlength="10" :rules="[rules.required]"></v-text-field>

        <v-text-field v-if="cupomForm.tipo === 'desconto'" v-model="cupomForm.porcentagem" label="Porcentagem de Desconto" 
          type="number" suffix="%" variant="outlined" class="mb-3" :rules="[rules.required, rules.percentage]"></v-text-field>

        <v-text-field v-if="cupomForm.tipo === 'teste_gratis'" v-model="cupomForm.diasTeste" label="Dias de Teste Grátis" 
          type="number" variant="outlined" class="mb-3" :rules="[rules.required, rules.positiveNumber]"></v-text-field>

        <v-text-field v-model="cupomForm.validade" label="Data de Validade" type="date" variant="outlined" class="mb-3"
          :rules="[rules.required]"></v-text-field>

        <v-text-field v-model="cupomForm.limiteUso" label="Limite de Uso" type="number" variant="outlined" class="mb-3"
          hint="Deixe em branco para ilimitado" persistent-hint></v-text-field>
      </v-form>

      <v-card-actions class="px-0 pt-4">
        <v-spacer></v-spacer>
        <v-btn variant="outlined" @click="closeModal" :disabled="loading">
          Cancelar
        </v-btn>
        <v-btn color="primary" @click="createCupom" :loading="loading">
          Criar Cupom
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="dialog" max-width="400" persistent>
    <v-card prepend-icon="mdi-post-outline" text="Deseja excluir este cupom?" title="Confirmação de Exclusão">
      <template v-slot:actions>
        <v-spacer></v-spacer>
        <v-btn @click="dialog = false"> recusar </v-btn>
        <v-btn @click="confirmDelete" color="primary" :loading="loadingDelete"> confirmar </v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import cupomService from '@/services/cupom/cupom-service'
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
const router = useRouter()
const search = ref('')
const cupons = ref<any[]>([])
const loading = ref(true)
const loadingDelete = ref(false)
const selectedCupom = ref<any | null>(null)
const dialog = ref(false)
const showModalCreateQRCODE = ref(false)
const formRef = ref<any>(null)
const cupomForm = ref({
  tipo: '',
  codigo: '',
  porcentagem: null,
  diasTeste: null,
  validade: '',
  limiteUso: null
})

const tiposCupom = [
  { title: 'Cupom de Desconto', value: 'desconto' },
  { title: 'Cupom de Teste Grátis', value: 'teste_gratis' }
]

const rules = {
  required: (value: any) => !!value || 'Campo obrigatório',
  percentage: (value: any) => (value > 0 && value <= 100) || 'Deve ser entre 1 e 100%',
  positiveNumber: (value: any) => (value > 0) || 'Deve ser maior que 0'
}

// Limpar campos condicionais quando o tipo mudar
watch(() => cupomForm.value.tipo, () => {
  cupomForm.value.porcentagem = null
  cupomForm.value.diasTeste = null
  if (formRef.value) {
    formRef.value.resetValidation()
  }
})

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import 'vue3-toastify/dist/index.css'
dayjs.extend(utc)
const headers = [
  { title: 'Código', key: 'codigo' },
  { title: 'Porcentagem', key: 'porcentagem', sortable: true, align: 'center' as const },
  { title: 'Dias de Teste', key: 'diasTrial', sortable: true, align: 'center' as const },
  { title: 'Validade', key: 'validade', sortable: true, align: 'center' as const },
  { title: 'Quan. Usadas', key: 'quantidadeUtilizada', sortable: true, align: 'center' as const },
  { title: 'Limite de Uso ', key: 'limiteMaximoDeUso', sortable: true, align: 'center' as const },
  { title: 'Criado Por', key: 'createdBy', sortable: true, align: 'center' as const },
  { title: 'Ações', key: 'actions', sortable: false, width: '150px' },
]

// Computed stats
const activeCount = computed(
  () => cupons.value?.filter((c) => c.ativo).length || 0
)

// Actions

const deleteCupom = (item: any) => {
  selectedCupom.value = item
  dialog.value = true
}

const confirmDelete = async () => {
  loadingDelete.value = true
  if (!selectedCupom.value) return

  try {
    await cupomService.deleteCupom(selectedCupom.value)
    toast.success('Cupom excluída com sucesso!')
  } catch (error) {
    toast.error('Error ao excluir Cupom')
    console.error('Erro ao excluir Cupom:', error)
  } finally {
    loadingDelete.value = false
    dialog.value = false
    selectedCupom.value = null
    getAllCupons()
  }
}
const createCupom = async () => {
  if (!formRef.value) return
  const { valid } = await formRef.value.validate()
  if (!valid) return

  loading.value = true
  try {
    const data: any = {
      codigo: cupomForm.value.codigo,
      validade: dayjs(cupomForm.value.validade).endOf('day').toISOString()
    }

    if (cupomForm.value.tipo === 'desconto') {
      data.porcentagem = Number(cupomForm.value.porcentagem)
    } else if (cupomForm.value.tipo === 'teste_gratis') {
      // Para teste grátis, porcentagem é obrigatória no DTO, então enviamos 0
      data.porcentagem = 0
      data.diasTrial = Number(cupomForm.value.diasTeste)
    }

    if (cupomForm.value.limiteUso) {
      data.limiteMaximoDeUso = Number(cupomForm.value.limiteUso)
    }

    await cupomService.createCupom(data)
    toast.success('Cupom criado com sucesso!')
    await getAllCupons()
    closeModal()
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || 'Erro ao criar o cupom'
    toast.error(errorMessage)
    console.error('Erro ao criar o cupom:', error)
  } finally {
    loading.value = false
  }
}

const closeModal = () => {
  showModalCreateQRCODE.value = false
  cupomForm.value = {
    tipo: '',
    codigo: '',
    porcentagem: null,
    diasTeste: null,
    validade: '',
    limiteUso: null
  }
  if (formRef.value) {
    formRef.value.resetValidation()
  }
}

const getAllCupons = async () => {
  try {
    const response = await cupomService.getAllCupons()
    cupons.value = Array.isArray(response.data) ? response.data : []
  } catch (error) {
    console.error('Erro ao carregar cupons:', error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await getAllCupons()
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
