<template>
  <v-container fluid class="pa-6">
    <!-- Header Section -->
    <v-row class="mb-6">
      <v-col cols="12">
        <div class="d-flex flex-column flex-sm-row justify-space-between align-start align-sm-center ga-4">
          <div class="header-content">
            <h1 class="text-h3 font-weight-bold text-primary mb-2">
              <v-icon icon="mdi-newspaper-variant" class="me-3" size="large"></v-icon>
              Marketplaces
            </h1>
            <p class="text-subtitle-1 text-medium-emphasis mb-0">
              Gerencie todos os Marketplaces
            </p>
          </div>
          <router-link :to="{ path: '/marketplace/form' }">
            <v-btn color="primary" size="large" prepend-icon="mdi-plus" class="create-btn" elevation="2">
              Criar Marketplace
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
                  {{ produtos?.length || 0 }}
                </div>
                <div class="text-caption text-medium-emphasis">
                  Total de Artigos
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
                  Artigos Ativos
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
                <div class="text-h5 font-weight-bold">{{ mobileCount }}</div>
                <div class="text-caption text-medium-emphasis">
                  Mobile Ready
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
                <div class="text-h5 font-weight-bold">{{ desktopCount }}</div>
                <div class="text-caption text-medium-emphasis">
                  Desktop Ready
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
            <span class="text-h6 font-weight-medium">Lista de Artigos</span>
          </div>
          <v-spacer class="d-none d-sm-flex"></v-spacer>
          <v-text-field v-model="search" density="comfortable" label="Buscar artigos..."
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
            <v-img :src="item.fotoUrl" alt="foto artigo" cover>
              <template v-slot:error>
                <v-icon icon="mdi-image-broken" size="24"></v-icon>
              </template>
            </v-img>
          </v-avatar>
        </template>

        <template v-slot:item.categoria="{ item }">
          {{ item.categoriaArtigo?.nome || 'Sem categoria' }}
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
            <v-btn icon="mdi-pencil" size="small" variant="text" color="warning" @click="editArticle(item.id)"></v-btn>
            <v-btn icon="mdi-delete" size="small" variant="text" color="error" @click="deleteArticle(item)"></v-btn>
          </div>
        </template>

        <!-- No data -->
        <template v-slot:no-data>
          <div class="text-center pa-8">
            <v-icon icon="mdi-newspaper-variant-outline" size="64" color="grey-lighten-1" class="mb-4"></v-icon>
            <div class="text-h6 text-medium-emphasis mb-2">
              Nenhum artigo encontrado
            </div>
            <div class="text-body-2 text-medium-emphasis">
              Comece criando seu primeiro artigo
            </div>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </v-container>



  <v-dialog v-model="dialog" max-width="400" persistent>

    <v-card prepend-icon="mdi-post-outline" text="Deseja excluir este artigo?" title="Confirmação de Exclusão">
      <template v-slot:actions>
        <v-spacer></v-spacer>

        <v-btn @click="dialog = false">
          recusar
        </v-btn>

        <v-btn @click="confirmDelete" color="primary">
          confirmar
        </v-btn>
      </template>
    </v-card>
  </v-dialog>

</template>

<script setup lang="ts">
// import type IArtigo from '@/Interfaces/artigo-interface'
import produtoService from '@/services/marketplace/marketplace-service'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const search = ref('')
const produtos = ref<any[]>([])
const loading = ref(true)
const selectedArticle = ref<any | null>(null)
const dialog = ref(false)
const headers = [
  { title: 'Foto', key: 'foto', sortable: true, width: '100px' },
  { title: 'Titulo', key: 'titulo',  },
  { title: 'Categoria', key: 'descricao', sortable: false,  },
  { title: 'Preco', key: 'preco', sortable: false, align: 'center' },
  { title: 'Desconto', key: 'desconto', sortable: false, align: 'center' },
  { title: 'Especial', key: 'condicaoEspecial', sortable: true, align: 'end' },
  { title: 'Certificado', key: 'exclusivoParaCertificado', sortable: true, align: 'end'},
  { title: 'Status', key: 'ativo', sortable: true,align: 'center' },
  { title: 'Ações', key: 'actions', sortable: false, width: '150px' },
]

// Computed stats
const activeCount = computed(
  () => produtos.value?.filter((produtos) => produtos.ativo).length || 0
)

const mobileCount = computed(
  () => produtos.value?.filter((produtos) => produtos.isMobile).length || 0
)

const desktopCount = computed(
  () => produtos.value?.filter((produtos) => produtos.isDesktop).length || 0
)

// Actions

const editArticle = (id: any) => {
  (window as any).editingArticleId = id
  router.push('/artigos/editForm')
}

const deleteArticle = (item: any) => {
  selectedArticle.value = item
  dialog.value = true
}


const confirmDelete = async () => {
  if (!selectedArticle.value) return

  try {
    await produtoService.deleteProduto(selectedArticle.value.id)
    produtos.value = produtos.value.filter(a => a.id !== selectedArticle.value?.id)
    console.log('Artigo excluído com sucesso')
  } catch (error) {
    console.error('Erro ao excluir artigo:', error)
  } finally {
    dialog.value = false
    selectedArticle.value = null
  }
}

onMounted(async () => {
  try {
    const response = await produtoService.getAllProdutos()
    console.log(response)
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
  } catch (error) {
    console.error('Erro ao carregar artigos:', error)
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
