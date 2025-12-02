<template>
  <v-container fluid class="pa-6">
    <!-- Header Section -->
    <v-row class="mb-6">
      <v-col cols="12">
        <div class="d-flex flex-column flex-sm-row justify-space-between align-start align-sm-center ga-4">
          <div class="header-content">
            <h1 class="text-h3 font-weight-bold text-primary mb-2">
              <v-icon icon="mdi-newspaper-variant" class="me-3" size="large"></v-icon>
              Artigos
            </h1>
            <p class="text-subtitle-1 text-medium-emphasis mb-0">
              Gerencie todos os artigos do blog
            </p>
          </div>
          <div class="d-flex flex-column ga-2">
            <router-link to="/artigos/form">
              <v-btn color="primary" size="large" prepend-icon="mdi-plus" class="create-btn" elevation="2">
                Criar Artigo
              </v-btn>
            </router-link>
            <v-btn
              prepend-icon="mdi-tag-plus"
              size="large"
              variant="outlined"
              color="primary"
              @click="createCategoryDialog = true"
              class="create-btn"
              elevation="1"
            >
              Nova Categoria
            </v-btn>
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
                  {{ artigos?.length || 0 }}
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

    <!-- Categories Section -->
    <v-card class="mb-6 main-card" elevation="2">
      <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-title>
            <div class="d-flex align-center">
              <v-icon icon="mdi-tag-multiple" class="me-2" color="primary"></v-icon>
              <span class="text-h6 font-weight-medium">Categorias de Artigos</span>
              <v-spacer></v-spacer>
              <v-chip class="ml-2" size="small" color="primary" variant="flat">
                {{ categorias.length }} categorias
              </v-chip>
            </div>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-data-table
              :headers="categoryHeaders"
              :items="categorias"
              :loading="loadingCategorias"
              class="custom-table"
              hover
            >
              <!-- Loading -->
              <template v-slot:loading>
                <v-skeleton-loader type="table-row@5"></v-skeleton-loader>
              </template>
              <!-- Nome -->
              <template v-slot:item.nome="{ item }">
                <div class="d-flex align-center">
                  <v-avatar color="primary" size="32" class="me-3">
                    <span class="text-caption font-weight-bold">{{ item.nome.charAt(0).toUpperCase() }}</span>
                  </v-avatar>
                  <span class="font-weight-medium">{{ item.nome }}</span>
                </div>
              </template>

              <!-- Data Criação -->
              <template v-slot:item.createdAt="{ item }">
                {{ formatDate(item.createdAt) }}
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
                    @click="editCategory(item)"
                  ></v-btn>
                  <v-btn
                    icon="mdi-delete"
                    size="small"
                    variant="text"
                    color="error"
                    @click="deleteCategory(item)"
                  ></v-btn>
                </div>
              </template>

              <!-- No data -->
              <template v-slot:no-data>
                <div class="text-center pa-8">
                  <v-icon icon="mdi-tag-outline" size="64" color="grey-lighten-1" class="mb-4"></v-icon>
                  <div class="text-h6 text-medium-emphasis mb-2">
                    Nenhuma categoria encontrada
                  </div>
                  <div class="text-body-2 text-medium-emphasis">
                    Crie sua primeira categoria
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
      <v-data-table v-model:search="search" :filter-keys="['titulo']" :headers="headers" :items="artigos"
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

        <!-- Título -->
        <template v-slot:item.titulo="{ item }">
          <div class="article-title">
            <div class="text-subtitle-1 font-weight-medium">{{ item.titulo }}</div>
            <div class="text-caption text-medium-emphasis">{{ item.subTitulo }}</div>
          </div>
        </template>
<template v-slot:item.categoria="{ item }">
  {{ item.categoriaArtigo?.nome || 'Sem categoria' }}
</template>
        <!-- Mobile -->
        <template v-slot:item.isMobile="{ item }">
          <v-chip :color="item.isMobile ? 'success' : 'error'" :prepend-icon="item.isMobile ? 'mdi-check' : 'mdi-close'"
            size="small" variant="flat">
            {{ item.isMobile ? 'Sim' : 'Não' }}
          </v-chip>
        </template>

        <!-- Desktop -->
        <template v-slot:item.isDesktop="{ item }">
          <v-chip :color="item.isDesktop ? 'success' : 'error'"
            :prepend-icon="item.isDesktop ? 'mdi-check' : 'mdi-close'" size="small" variant="flat">
            {{ item.isDesktop ? 'Sim' : 'Não' }}
          </v-chip>
        </template>

        <!-- Status -->
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



 <!-- Dialog Exclusão Artigo -->
  <v-dialog v-model="dialog" max-width="400" persistent>
    <v-card
      prepend-icon="mdi-post-outline"
      text="Deseja excluir este artigo?"
      title="Confirmação de Exclusão"
    >
      <template v-slot:actions>
        <v-spacer></v-spacer>
        <v-btn @click="dialog = false">recusar</v-btn>
        <v-btn @click="confirmDelete" color="primary" :loading="deleteLoading">
          confirmar
        </v-btn>
      </template>
    </v-card>
  </v-dialog>

  <!-- Dialog Exclusão Categoria -->
  <v-dialog v-model="categoryDialog" max-width="400" persistent>
    <v-card
      prepend-icon="mdi-tag-outline"
      text="Deseja excluir esta categoria?"
      title="Confirmação de Exclusão"
    >
      <template v-slot:actions>
        <v-spacer></v-spacer>
        <v-btn @click="categoryDialog = false">recusar</v-btn>
        <v-btn @click="confirmDeleteCategory" color="primary" :loading="deleteLoading">
          confirmar
        </v-btn>
      </template>
    </v-card>
  </v-dialog>

  <!-- Dialog Edição Categoria -->
  <v-dialog v-model="editCategoryDialog" max-width="600" persistent>
    <div>
      <!-- Formulário Principal -->
      <v-card v-if="!showEditCategoryPreview" prepend-icon="mdi-tag-outline" title="Editar Categoria">
        <v-card-text>
          <v-text-field
            v-model="editCategoryName"
            label="Nome da Categoria (PT-BR)"
            variant="outlined"
            density="comfortable"
            :rules="[v => !!v || 'Nome é obrigatório']"
            class="mb-4"
          ></v-text-field>

          <v-switch
            v-model="editCategoryActive"
            label="Ativo"
            color="primary"
            hide-details
          ></v-switch>
        </v-card-text>
        <template v-slot:actions>
          <v-spacer></v-spacer>
          <v-btn @click="editCategoryDialog = false">cancelar</v-btn>
          <v-btn @click="showEditCategoryPreviewForm" color="primary" :loading="editTranslateLoading" :disabled="!editCategoryName.trim()">
            Próximo: Visualizar
          </v-btn>
        </template>
      </v-card>

      <!-- Preview da Categoria -->
      <v-card v-else prepend-icon="mdi-eye" title="Prévia da Categoria">
        <v-card-text>
          <div class="d-flex justify-end mb-4">
            <v-btn-toggle v-model="currentEditCategoryLanguage" mandatory>
              <v-btn value="pt" size="small">PT</v-btn>
              <v-btn value="en" size="small">EN</v-btn>
            </v-btn-toggle>
          </div>

          <v-text-field
            v-model="editCategoryPreviewData[currentEditCategoryLanguage].nome"
            :label="`Nome da Categoria (${currentEditCategoryLanguage.toUpperCase()})`"
            variant="outlined"
            density="comfortable"
            class="mb-4"
          ></v-text-field>

          <v-switch
            v-model="editCategoryActive"
            label="Ativo"
            color="primary"
            hide-details
          ></v-switch>
        </v-card-text>
        <template v-slot:actions>
          <v-spacer></v-spacer>
          <v-btn @click="showEditCategoryPreview = false">voltar</v-btn>
          <v-btn @click="confirmEditCategory" color="primary" :loading="editLoading">
            salvar categoria
          </v-btn>
        </template>
      </v-card>
    </div>
  </v-dialog>

  <!-- Dialog Criação Categoria -->
  <v-dialog v-model="createCategoryDialog" max-width="600" persistent>
    <div>
      <!-- Formulário Principal -->
      <v-card v-if="!showCategoryPreview" prepend-icon="mdi-tag-plus" title="Criar Categoria">
        <v-card-text>
          <v-text-field
            v-model="createCategoryName"
            label="Nome da Categoria (PT-BR)"
            variant="outlined"
            density="comfortable"
            :rules="[v => !!v || 'Nome é obrigatório']"
            class="mb-4"
          ></v-text-field>

          <v-switch
            v-model="createCategoryActive"
            label="Categoria ativa"
            color="primary"
            hide-details
          ></v-switch>
        </v-card-text>
        <template v-slot:actions>
          <v-spacer></v-spacer>
          <v-btn @click="createCategoryDialog = false">cancelar</v-btn>
          <v-btn @click="showCategoryPreviewForm" color="primary" :loading="translateLoading" :disabled="!createCategoryName.trim()">
            Próximo: Visualizar
          </v-btn>
        </template>
      </v-card>

      <!-- Preview da Categoria -->
      <v-card v-else prepend-icon="mdi-eye" title="Prévia da Categoria">
        <v-card-text>
          <div class="d-flex justify-end mb-4">
            <v-btn-toggle v-model="currentCategoryLanguage" mandatory>
              <v-btn value="pt" size="small">PT</v-btn>
              <v-btn value="en" size="small">EN</v-btn>
            </v-btn-toggle>
          </div>

          <v-text-field
            v-model="categoryPreviewData[currentCategoryLanguage].nome"
            :label="`Nome da Categoria (${currentCategoryLanguage.toUpperCase()})`"
            variant="outlined"
            density="comfortable"
            class="mb-4"
          ></v-text-field>

          <v-switch
            v-model="createCategoryActive"
            label="Categoria ativa"
            color="primary"
            hide-details
          ></v-switch>
        </v-card-text>
        <template v-slot:actions>
          <v-spacer></v-spacer>
          <v-btn @click="showCategoryPreview = false">voltar</v-btn>
          <v-btn @click="confirmCreateCategory" color="primary" :loading="createLoading">
            criar categoria
          </v-btn>
        </template>
      </v-card>
    </div>
  </v-dialog>

</template>

<script setup lang="ts">
// import type IArtigo from '@/Interfaces/artigo-interface'
import artigoService from '@/services/artigo/artigo-service'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
const router = useRouter()
const search = ref('')
const artigos = ref<any[]>([])
const categorias = ref<any[]>([])
const loading = ref(true)
const loadingCategorias = ref(true)
const selectedArticle = ref<any | null>(null)
const selectedCategory = ref<any | null>(null)
const dialog = ref(false)
const categoryDialog = ref(false)
const editCategoryDialog = ref(false)
const createCategoryDialog = ref(false)
const deleteLoading = ref(false)
const editCategoryName = ref('')
const createCategoryName = ref('')
const editCategoryActive = ref<boolean>(true)
const createCategoryActive = ref<boolean>(true)
const editLoading = ref(false)
const createLoading = ref(false)
const translateLoading = ref(false)
const showCategoryPreview = ref(false)
const currentCategoryLanguage = ref('en')

const categoryPreviewData = ref({
  pt: {
    nome: ''
  },
  en: {
    nome: ''
  }
})

const editTranslateLoading = ref(false)
const showEditCategoryPreview = ref(false)
const currentEditCategoryLanguage = ref('en')

const editCategoryPreviewData = ref({
  pt: {
    nome: ''
  },
  en: {
    nome: ''
  }
})
const headers = [
  { title: 'Foto', key: 'foto', sortable: true, width: '100px' },
  { title: 'Titulo', key: 'titulo', width: '700px' },
  { title: 'Categoria', key: 'categoria', sortable: false },
  { title: 'Mobile', key: 'isMobile', sortable: true, width: '120px' },
  { title: 'Desktop', key: 'isDesktop', sortable: true, width: '120px' },
  { title: 'Status', key: 'ativo', sortable: true, width: '120px' },
  { title: 'Ações', key: 'actions', sortable: false, width: '150px' },
]

const categoryHeaders = [
  { title: 'Nome', key: 'nome', sortable: true },
  { title: 'ID', key: 'id', sortable: true, width: '100px' },
  { title: 'Data Criação', key: 'createdAt', sortable: true, width: '150px' },
  { title: 'Status', key: 'ativo', sortable: true, width: '120px' },
  { title: 'Ações', key: 'actions', sortable: false, width: '100px' },
]

// Computed stats
const activeCount = computed(
  () => artigos.value?.filter((artigo) => artigo.ativo).length || 0
)

const mobileCount = computed(
  () => artigos.value?.filter((artigo) => artigo.isMobile).length || 0
)

const desktopCount = computed(
  () => artigos.value?.filter((artigo) => artigo.isDesktop).length || 0
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


const deleteCategory = (item: any) => {
  selectedCategory.value = item
  categoryDialog.value = true
}

const editCategory = (item: any) => {
  selectedCategory.value = item
  editCategoryName.value = item.nome
  editCategoryActive.value = item.ativo
  
  // Carregar dados existentes no preview
  editCategoryPreviewData.value.pt.nome = item.nome
  editCategoryPreviewData.value.en.nome = item.en_nome || ''
  
  editCategoryDialog.value = true
}

const showEditCategoryPreviewForm = async () => {
  if (!editCategoryName.value.trim()) return

  editTranslateLoading.value = true
  try {
    editCategoryPreviewData.value.pt.nome = editCategoryName.value
    
    // Se não tem tradução existente, traduzir
    if (!editCategoryPreviewData.value.en.nome) {
      editCategoryPreviewData.value.en.nome = await traduzirTexto('pt', 'en', editCategoryName.value)
    }
    
    showEditCategoryPreview.value = true
  } catch (error) {
    toast.error('Erro ao traduzir categoria')
    console.error('Error translating category:', error)
  } finally {
    editTranslateLoading.value = false
  }
}

const confirmEditCategory = async () => {
  if (!selectedCategory.value) return

  editLoading.value = true
  try {
    await artigoService.updateCategoria(selectedCategory.value.id, {
      nome: editCategoryPreviewData.value.pt.nome,
      en_nome: editCategoryPreviewData.value.en.nome,
      ativo: editCategoryActive.value
    })

    // Recarregar categorias da API
    await buscarCategrias()

    toast.success('Categoria atualizada com sucesso!')
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error)
    toast.error('Erro ao atualizar categoria')
  } finally {
    editLoading.value = false
    editCategoryDialog.value = false
    showEditCategoryPreview.value = false
    selectedCategory.value = null
    editCategoryName.value = ''
    editCategoryActive.value = true
    editCategoryPreviewData.value = {
      pt: { nome: '' },
      en: { nome: '' }
    }
  }
}

const traduzirTexto = async (sourceLanguage = 'pt', targetLanguage = 'en', content) => {
  if (!content || content.trim() === '') return ''

  try {
    const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        q: content,
        source: sourceLanguage,
        target: targetLanguage
      })
    })

    if (!response.ok) {
      throw new Error('Failed to translate text', response.statusText)
    }

    const data = await response.json()
    return data.data.translations[0].translatedText

  } catch (error) {
    console.error('Translation error:', error)
    return content
  }
}

const showCategoryPreviewForm = async () => {
  if (!createCategoryName.value.trim()) return

  translateLoading.value = true
  try {
    categoryPreviewData.value.pt.nome = createCategoryName.value
    categoryPreviewData.value.en.nome = await traduzirTexto('pt', 'en', createCategoryName.value)
    
    showCategoryPreview.value = true
  } catch (error) {
    toast.error('Erro ao traduzir categoria')
    console.error('Error translating category:', error)
  } finally {
    translateLoading.value = false
  }
}

const confirmCreateCategory = async () => {
  createLoading.value = true
  try {
    await artigoService.criarCategoria({
      nome: categoryPreviewData.value.pt.nome,
      en_nome: categoryPreviewData.value.en.nome,
      ativo: createCategoryActive.value
    })

    // Recarregar categorias da API
    await buscarCategrias()

    toast.success('Categoria criada com sucesso!')
  } catch (error) {
    console.error('Erro ao criar categoria:', error)
    toast.error('Erro ao criar categoria')
  } finally {
    createLoading.value = false
    createCategoryDialog.value = false
    showCategoryPreview.value = false
    createCategoryName.value = ''
    createCategoryActive.value = true
    categoryPreviewData.value = {
      pt: { nome: '' },
      en: { nome: '' }
    }
  }
}

const confirmDeleteCategory = async () => {
  if (!selectedCategory.value) return

  deleteLoading.value = true
  try {
    await artigoService.apagarCategoria(selectedCategory.value.id)
    categorias.value = categorias.value.filter(c => c.id !== selectedCategory.value?.id)
    toast.success('Categoria excluída com sucesso!')
  } catch (error) {
    console.error('Erro ao excluir categoria:', error)
    toast.error('Erro ao excluir categoria')
  } finally {
    deleteLoading.value = false
    categoryDialog.value = false
    selectedCategory.value = null
  }
}

const confirmDelete = async () => {
  if (!selectedArticle.value) return

  deleteLoading.value = true
  try {
    await artigoService.deleteArtigo(selectedArticle.value.id)
    artigos.value = artigos.value.filter(a => a.id !== selectedArticle.value?.id)
    toast.success('Artigo excluído com sucesso!')
  } catch (error) {
    console.error('Erro ao excluir artigo:', error)
    toast.error('Erro ao excluir artigo')
  } finally {
    deleteLoading.value = false
    dialog.value = false
    selectedArticle.value = null
  }
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('pt-BR')
}

const buscarCategrias = async () => {
  loadingCategorias.value = true
  try {
    const response = await artigoService.getAllCategorias()
    categorias.value = response.data
  } catch (error) {
    console.error('Erro ao buscar categorias:', error)
  } finally {
    loadingCategorias.value = false
  }
}

onMounted(async () => {
  try {
    // Carregar artigos
    const artigosResponse = await artigoService.getAllArtigos()
    artigos.value = Array.isArray(artigosResponse.data)
      ? artigosResponse.data.map((artigo:any) => {
          const imgNaoBanner = artigo.imagensArtigo?.find(
            (img:any) => img.isBanner === false
          )
          return {
            ...artigo,
            fotoUrl: imgNaoBanner ? imgNaoBanner.imagemUrl : null
          }
        })
      : []

      buscarCategrias()
    // Carregar categorias
    // const categoriasResponse = await artigoService.getAllCategorias()
    // categorias.value = Array.isArray(categoriasResponse) ? categoriasResponse : []
    // console.log('Categorias carregadas:', categorias.value)
  } catch (error) {
    console.error('Erro ao carregar dados:', error)
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
  max-width: 250px;
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
