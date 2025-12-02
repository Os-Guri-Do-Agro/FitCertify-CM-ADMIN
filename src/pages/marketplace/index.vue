<template>
  <v-container fluid class="pa-6">
    <!-- Header Section -->
    <v-row class="mb-6">
      <v-col cols="12">
        <div class="d-flex flex-column flex-sm-row justify-space-between align-start align-sm-center ga-4">
          <div class="header-content">
            <h1 class="text-h3 font-weight-bold text-primary mb-2">
              <v-icon icon="mdi-shopping-outline" class="me-3" size="large"></v-icon>
              Marketplaces
            </h1>
            <p class="text-subtitle-1 text-medium-emphasis mb-0">
              Gerencie todos os Marketplaces
            </p>
          </div>
          <div class="d-flex flex-column ga-2">
            <router-link :to="{ path: '/marketplace/form' }">
              <v-btn color="primary" size="large" prepend-icon="mdi-plus" class="create-btn" elevation="2">
                Criar Produto
              </v-btn>
            </router-link>
            <router-link :to="{ path: '/marketplace/empresa/form' }">
              <v-btn
                prepend-icon="mdi-domain-plus"
                size="large"
                variant="outlined"
                color="primary"
                class="create-btn"
                elevation="1"
              >
                Nova Empresa
              </v-btn>
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
                  {{ produtos?.length || 0 }}
                </div>
                <div class="text-caption text-medium-emphasis">
                  Total de Produtos
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
                  Produtos Ativos
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
              <v-avatar color="info" class="me-3">
                <v-icon icon="mdi-cellphone" color="white"></v-icon>
              </v-avatar>
              <div>
                <div class="text-h5 font-weight-bold">{{ EspecialCondition }}</div>
                <div class="text-caption text-medium-emphasis">
                  Condições Especiais Ativas
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
              <v-avatar color="warning" class="me-3">
                <v-icon icon="mdi-monitor" color="white"></v-icon>
              </v-avatar>
              <div>
                <div class="text-h5 font-weight-bold">{{ CertificadoCount }}</div>
                <div class="text-caption text-medium-emphasis">
                   Exclusivo Certificado Ativas
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Companies Section -->
    <v-card class="mb-6 main-card" elevation="2">
      <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-title>
            <div class="d-flex align-center">
              <v-icon icon="mdi-domain" class="me-2" color="primary"></v-icon>
              <span class="text-h6 font-weight-medium">Empresas do Marketplace</span>
              <v-spacer></v-spacer>
              <v-chip class="ml-2" size="small" color="primary" variant="flat">
                {{ empresas.length }} empresas
              </v-chip>
            </div>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-data-table
              :headers="companyHeaders"
              :items="empresas"
              :loading="loadingEmpresas"
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
                  <v-img :src="item.logoUrl" alt="logo empresa" cover>
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

              <!-- Sobre -->
              <template v-slot:item.sobre="{ item }">
                <div class="text-truncate" style="max-width: 280px;">
                  {{ item.sobre || 'Sem descrição' }}
                </div>
              </template>

              <!-- Status -->
              <template v-slot:item.ativo="{ item }">
                <v-chip
                  :color="item.ativo ? 'success' : 'error'"
                  :prepend-icon="item.ativo ? 'mdi-check-circle' : 'mdi-close-circle'"
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
                    @click="editEmpresa(item)"
                  ></v-btn>
                  <v-btn
                    icon="mdi-delete"
                    size="small"
                    variant="text"
                    color="error"
                    @click="deleteEmpresa(item)"
                  ></v-btn>
                </div>
              </template>

              <!-- No data -->
              <template v-slot:no-data>
                <div class="text-center pa-8">
                  <v-icon icon="mdi-domain-outline" size="64" color="grey-lighten-1" class="mb-4"></v-icon>
                  <div class="text-h6 text-medium-emphasis mb-2">
                    Nenhuma empresa encontrada
                  </div>
                  <div class="text-body-2 text-medium-emphasis">
                    As empresas aparecerão aqui
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
      <v-data-table v-model:search="search" :filter-keys="['titulo']" :headers="headers" :items="produtos"
        :loading="loading" class="custom-table" hover>
        <!-- Loading -->
        <template v-slot:loading>
          <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
        </template>

        <!-- Foto -->
        <template v-slot:item.foto="{ item }">
          <v-avatar size="48" class="ma-2">
            <v-img :src="item.imagemUrl" alt="foto produto" cover>
              <template v-slot:error>
                <v-icon icon="mdi-image-broken" size="24"></v-icon>
              </template>
            </v-img>
          </v-avatar>
        </template>

        <template v-slot:item.categoria="{ item }">
          {{ item.categoriaProduto?.nome || 'Sem categoria' }}
        </template>
        <!-- Mobile -->

        <template v-slot:item.condicaoEspecial="{ item }">
          <v-chip :color="item.condicaoEspecial ? 'success' : 'warning'"
            :prepend-icon="item.condicaoEspecial ? 'mdi-check-circle' : 'mdi-pause-circle'" size="small" variant="flat">
            {{ item.condicaoEspecial ? 'Ativo' : 'Inativo' }}
          </v-chip>
        </template>
        <template v-slot:item.exclusivoParaCertificado="{ item }">
          <v-chip :color="item.exclusivoParaCertificado ? 'success' : 'warning'"
            :prepend-icon="item.exclusivoParaCertificado ? 'mdi-check-circle' : 'mdi-pause-circle'" size="small"
            variant="flat">
            {{ item.exclusivoParaCertificado ? 'Ativo' : 'Inativo' }}
          </v-chip>
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
            <v-btn icon="mdi-pencil" size="small" variant="text" color="warning" @click="editMarketplace(item.id)"></v-btn>
            <v-btn icon="mdi-delete" size="small" variant="text" color="error" @click="deleteMarketplace(item)"></v-btn>
          </div>
        </template>

        <!-- No data -->
        <template v-slot:no-data>
          <div class="text-center pa-8">
            <v-icon icon="mdi-newspaper-variant-outline" size="64" color="grey-lighten-1" class="mb-4"></v-icon>
            <div class="text-h6 text-medium-emphasis mb-2">
              Nenhum Produto encontrado
            </div>
            <div class="text-body-2 text-medium-emphasis">
              Comece criando seu primeiro Produto
            </div>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </v-container>



  <v-dialog v-model="dialog" max-width="400" persistent>

    <v-card prepend-icon="mdi-post-outline" text="Deseja excluir este Produto?" title="Confirmação de Exclusão">
      <template v-slot:actions>
        <v-spacer></v-spacer>

        <v-btn @click="dialog = false">
          recusar
        </v-btn>

        <v-btn @click="confirmDelete" color="primary" :loading="loadingDelete">
          confirmar
        </v-btn>
      </template>
    </v-card>
  </v-dialog>

  <!-- Dialog Exclusão Empresa -->
  <v-dialog v-model="empresaDialog" max-width="400" persistent>
    <v-card
      prepend-icon="mdi-domain-outline"
      text="Deseja excluir esta empresa?"
      title="Confirmação de Exclusão"
    >
      <template v-slot:actions>
        <v-spacer></v-spacer>
        <v-btn @click="empresaDialog = false">recusar</v-btn>
        <v-btn @click="confirmDeleteEmpresa" color="primary" :loading="loadingDelete">
          confirmar
        </v-btn>
      </template>
    </v-card>
  </v-dialog>

</template>

<script setup lang="ts">
import produtoService from '@/services/marketplace/marketplace-service'
import empresaService from '@/services/empresa/empresa-service'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast} from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
const router = useRouter()
const search = ref('')
const produtos = ref<any[]>([])
const empresas = ref<any[]>([])
const loading = ref(true)
const loadingEmpresas = ref(true)
const loadingDelete = ref(false)
const selectedMarketplace = ref<any | null>(null)
const selectedEmpresa = ref<any | null>(null)
const dialog = ref(false)
const empresaDialog = ref(false)
const headers = [
  { title: 'Foto', key: 'foto', sortable: true, width: '100px' },
  { title: 'Titulo', key: 'titulo' },
  { title: 'Categoria', key: 'categoria', sortable: false },
  { title: 'Preco', key: 'preco', sortable: false, align: "center" as const },
  { title: 'Desconto', key: 'desconto', sortable: false, align: "center" as const },
  { title: 'Especial', key: 'condicaoEspecial', sortable: true, align: "end" as const },
  { title: 'Certificado', key: 'exclusivoParaCertificado', sortable: true, align: "end" as const },
  { title: 'Status', key: 'ativo', sortable: true, align: "center" as const },
  { title: 'Ações', key: 'actions', sortable: false, width: '150px' },
]

const companyHeaders = [
  { title: 'Logo', key: 'logoUrl', sortable: false, width: '80px' },
  { title: 'Nome', key: 'nome', sortable: true },
  { title: 'Sobre', key: 'sobre', sortable: false, width: '300px' },
  { title: 'Status', key: 'ativo', sortable: true, width: '120px' },
  { title: 'Ações', key: 'actions', sortable: false, width: '100px' },
]

// Computed stats
const activeCount = computed(
  () => produtos.value?.filter((produtos) => produtos.ativo).length || 0
)

const EspecialCondition = computed(
  () => produtos.value?.filter((produtos) => produtos.condicaoEspecial).length || 0
)

const CertificadoCount = computed(
  () => produtos.value?.filter((produtos) => produtos.exclusivoParaCertificado).length || 0
)

// Actions

const editMarketplace = (id: any) => {
  (window as any).editingProdutoId = id
  router.push('/marketplace/editForm')
}

const deleteMarketplace = (item: any) => {
  selectedMarketplace.value = item
  dialog.value = true
}


const editEmpresa = (item: any) => {
  (window as any).editingEmpresaId = item.id
  router.push('/marketplace/empresa/editForm')
}

const deleteEmpresa = (item: any) => {
  selectedEmpresa.value = item
  empresaDialog.value = true
}

const confirmDeleteEmpresa = async () => {
  if (!selectedEmpresa.value) return

  loadingDelete.value = true
  try {
    await empresaService.deleteEmpresa(selectedEmpresa.value.id)
    empresas.value = empresas.value.filter(e => e.id !== selectedEmpresa.value?.id)
    toast.success('Empresa excluída com sucesso!')
  } catch (error) {
    console.error('Erro ao excluir empresa:', error)
    toast.error('Erro ao excluir empresa')
  } finally {
    loadingDelete.value = false
    empresaDialog.value = false
    selectedEmpresa.value = null
  }
}

const confirmDelete = async () => {
  loadingDelete.value = true
  if (!selectedMarketplace.value) return

  try {
    await produtoService.deleteProduto(selectedMarketplace.value.id)
    produtos.value = produtos.value.filter(a => a.id !== selectedMarketplace.value?.id)
    toast.success('Produto excluído com sucesso!')
  } catch (error) {
    toast.error('Erro ao excluir produto')
    console.error('Erro ao excluir Produto:', error)
  } finally {
    loadingDelete.value = false
    dialog.value = false
    selectedMarketplace.value = null
  }
}

onMounted(async () => {
  try {
    // Carregar produtos
    const response = await produtoService.getAllProdutos()
    produtos.value = Array.isArray(response.data)
      ? response.data.map((produto: any) => {
        // Procura a primeira imagem onde isBanner é false
        const imgNaoBanner = produto.imagensArtigo?.find(
          (img: any) => img.isBanner === false
        )

        return {
          ...produto,
          fotoUrl: imgNaoBanner ? imgNaoBanner.imagemUrl : null
        }
      })
      : []
    
    // Carregar empresas
    const empresaResponse = await empresaService.getAllEmpresas()
    empresas.value = Array.isArray(empresaResponse.data) ? empresaResponse.data : []
  } catch (error) {
    console.error('Erro ao carregar dados:', error)
  } finally {
    loading.value = false
    loadingEmpresas.value = false
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
