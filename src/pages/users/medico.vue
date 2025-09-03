<template>
  <!-- Header Section -->
  <v-container fluid class="pa-6">
    <!-- Header -->
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
                  {{ CountActiveUsers }}
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
              <v-avatar color="success" class="me-3">
                <v-icon icon="mdi-check-circle" color="white"></v-icon>
              </v-avatar>
              <div>
                <div class="text-h5 font-weight-bold">{{ CountAllUsers }}</div>
                <div class="text-caption text-medium-emphasis">
                  Total de Médicos cadastrados
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
            <span class="text-h6 font-weight-medium">Lista de Médicos</span>
          </div>
          <v-spacer class="d-none d-sm-flex"></v-spacer>
          <v-text-field v-model="search" density="comfortable" label="Buscar Médicos..."
            prepend-inner-icon="mdi-magnify" variant="outlined" hide-details single-line class="search-field"
            style="max-width: 300px"></v-text-field>
        </div>
      </v-card-title>

      <v-divider></v-divider>

      <!-- Data Table -->
      <v-data-table v-model:search="search" :filter-keys="['usuario.nome']" :headers="headers" :items="AllUsers"
        :loading="loading" class="custom-table" hover>
        <!-- Loading -->
        <template v-slot:loading>
          <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
        </template>

        <!-- Avatar -->


        <template v-slot:item.ativo="{ item }">
          <v-chip :color="item.ativo ? 'success' : 'warning'"
            :prepend-icon="item.ativo ? 'mdi-check-circle' : 'mdi-pause-circle'" size="small" variant="flat">
            {{ item.ativo ? 'Ativo' : 'Inativo' }}
          </v-chip>
        </template>


        <template v-slot:item.dataNascimento="{ item }">
          {{ dayjs(item.dataNascimento).format('DD/MM/YYYY') }}
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


        <!-- No data -->
        <template v-slot:no-data>
          <div class="text-center pa-8">
            <v-icon icon="mdi-newspaper-variant-outline" size="64" color="grey-lighten-1" class="mb-4"></v-icon>
            <div class="text-h6 text-medium-emphasis mb-2">
              Nenhum atleta encontrado
            </div>
            <div class="text-body-2 text-medium-emphasis">
              Nenhum atleta cadastrado no sistema
            </div>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </v-container>

  <v-dialog v-model="dialog" max-width="400" persistent>
    <v-card prepend-icon="mdi-account-remove" text="Deseja excluir este usuário?" title="Confirmação de Exclusão">
      <template v-slot:actions>
        <v-spacer></v-spacer>

        <v-btn @click="dialog = false"> recusar </v-btn>

        <!-- <v-btn @click="confirmDelete" color="primary"> confirmar </v-btn> -->
      </template>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import medicosService from '@/services/medicos/medicos-service'
import { onMounted, ref } from 'vue'
// import { useRouter } from 'vue-router'
import dayjs from 'dayjs'

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
const loading = ref(true)
// const selectedUser = ref<any | null>(null)
const dialog = ref(false)
const CountActiveUsers = ref()
const CountAllUsers = ref()
const headers = [
  { title: 'Nome', key: 'usuario.nome' },
  { title: 'CPF', key: 'usuario.cpf' },
  { title: 'Email', key: 'usuario.email' },
  { title: 'Ativo', key: 'ativo', },
]


onMounted(async () => {
  try {
    const response = await medicosService.getAllMedicos()
    console.log(response)
    CountActiveUsers.value = response.data.filter((e: any) => e.ativo == true).length
    CountAllUsers.value = response.data.length
    AllUsers.value = response.data || []
  } catch (error) {
    console.error('Erro ao carregar usuários:', error)
  } finally {
    loading.value = false
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
