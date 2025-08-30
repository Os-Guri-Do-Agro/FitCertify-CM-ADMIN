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
              Organização
            </h1>
            <p class="text-subtitle-1 text-medium-emphasis mb-0">
              Gerencie todas as Organizações aqui. Você pode criar, editar e
              excluir Organizacoes.
            </p>
          </div>
          <router-link :to="{ path: '/organizacao/form' }">
            <v-btn
              color="primary"
              size="large"
              prepend-icon="mdi-plus"
              class="create-btn"
              elevation="2"
            >
              Criar Organização
            </v-btn>
          </router-link>
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
                  {{ organizacao?.length || 0 }}
                </div>
                <div class="text-caption text-medium-emphasis">
                  Total de Organizações
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
                  Organizações Ativas
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
        <div
          class="d-flex flex-column flex-sm-row align-start align-sm-center ga-4 w-100"
        >
          <div class="d-flex align-center">
            <v-icon icon="mdi-table" class="me-2" color="primary"></v-icon>
            <span class="text-h6 font-weight-medium">Lista de Organizacão</span>
          </div>
          <v-spacer class="d-none d-sm-flex"></v-spacer>
          <v-text-field
            v-model="search"
            density="comfortable"
            label="Buscar Organizacão..."
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
        :items="organizacao"
        :loading="loading"
        class="custom-table"
        hover
      >
        <!-- Loading -->
        <template v-slot:loading>
          <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
        </template>

        <!-- Foto -->
        <template v-slot:item.logoUrl="{ item }">
          <v-avatar size="48" class="ma-2">
            <v-img :src="item.logoUrl" alt="foto organizacao" cover>
              <template v-slot:error>
                <v-icon icon="mdi-image-broken" size="24"></v-icon>
              </template>
            </v-img>
          </v-avatar>
        </template>

        <template v-slot:item.categoria="{ item }">
          {{ item.categoriaProduto?.nome || 'Sem categoria' }}
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
              @click="editOrganizacao(item.id)"
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
            <v-icon
              icon="mdi-newspaper-variant-outline"
              size="64"
              color="grey-lighten-1"
              class="mb-4"
            ></v-icon>
            <div class="text-h6 text-medium-emphasis mb-2">
              Nenhuma organização encontrado
            </div>
            <div class="text-body-2 text-medium-emphasis">
              Comece criando sua primeira Organização
            </div>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </v-container>

  <v-dialog v-model="dialog" max-width="400" persistent>
    <v-card
      prepend-icon="mdi-post-outline"
      text="Deseja excluir este organização?"
      title="Confirmação de Exclusão"
    >
      <template v-slot:actions>
        <v-spacer></v-spacer>

        <v-btn @click="dialog = false"> recusar </v-btn>

        <v-btn @click="confirmDelete" color="primary" :loading="loadingDelete"> confirmar </v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import organizacaoService from '@/services/organizacao-evento/organizacao-evento-service'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const search = ref('')
const organizacao = ref<any[]>([])
const loading = ref(true)
const loadingDelete = ref(false)
const selectedOrganizacao = ref<any | null>(null)
const dialog = ref(false)
const headers = [
  { title: 'Logo', key: 'logoUrl', sortable: false, width: '100px' },
  { title: 'Nome', key: 'nome' },
  { title: 'Ações', key: 'actions', sortable: false, width: '150px' },
]

// Computed stats
const activeCount = computed(
  () =>
    organizacao.value?.filter((organizacao) => organizacao.ativo).length || 0
)

// Actions

const editOrganizacao = (id: any) => {
  ;(window as any).editingOrganizacaoId = id
  router.push('/organizacao/editForm')
}

const deleteOrganizacao = (item: any) => {
  selectedOrganizacao.value = item
  dialog.value = true
}

const confirmDelete = async () => {
  loadingDelete.value = true
  if (!selectedOrganizacao.value) return

  try {
    await organizacaoService.deleteOrganizacao(selectedOrganizacao.value.id)
    organizacao.value = organizacao.value.filter(
      (a) => a.id !== selectedOrganizacao.value?.id
    )
    console.log('Organização excluído com sucesso')
  } catch (error) {
    console.error('Erro ao excluir Organização:', error)
  } finally {
    loadingDelete.value = false
    dialog.value = false
    selectedOrganizacao.value = null
  }
}

onMounted(async () => {
  try {
    const response = await organizacaoService.getAllOrganizacoes()
    console.log(response)
    organizacao.value = Array.isArray(response.data) ? response.data : []
    console.log(organizacao.value)
  } catch (error) {
    console.error('Erro ao carregar organizacao:', error)
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
