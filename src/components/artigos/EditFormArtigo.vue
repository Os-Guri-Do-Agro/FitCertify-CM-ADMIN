<template>
<div>
  <!-- Formulário Principal -->
  <v-card v-if="!showPreview" class="form-card" elevation="4">
    <v-card-title class="pa-6 pb-4">
      <div class="d-flex align-center">
        <v-icon icon="mdi-form-select" class="me-2" color="primary"></v-icon>
        <span class="text-h6 font-weight-medium">{{ props.id ? 'Editar Artigo' : 'Criar Novo Artigo' }}</span>
      </div>
    </v-card-title>

    <v-divider></v-divider>

    <v-card-text class="pa-6">
      <v-form ref="formRef" @submit.prevent="showPreviewForm">
      <!-- Basic Information Section -->
      <div class="mb-6">
        <h3 class="text-h6 font-weight-medium mb-4 text-primary">
          <v-icon icon="mdi-information" class="me-2" size="small"></v-icon>
          Informações Básicas
        </h3>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.titulo"
              label="Título"
              variant="outlined"
              prepend-inner-icon="mdi-format-title"
              :rules="[rules.required]"
              required
              density="comfortable"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.subTitulo"
              label="Subtítulo"
              variant="outlined"
              prepend-inner-icon="mdi-format-header-2"
              :rules="[rules.required]"
              required
              density="comfortable"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-combobox
              v-model="categoriasArtigoSelected"
              variant="outlined"
              label="Categoria"
              prepend-inner-icon="mdi-tag"
              :items="categoriasArtigo"
              item-title="nome"
              item-value="id"
              density="comfortable"
            ></v-combobox>
          </v-col>
        </v-row>
      </div>

      <!-- Content Section -->
      <div class="mb-6">
        <h3 class="text-h6 font-weight-medium mb-4 text-primary">
          <v-icon icon="mdi-text" class="me-2" size="small"></v-icon>
          Conteúdo
        </h3>
        <v-row>
          <v-col cols="12" md="6">
            <v-textarea
              v-model="form.introducao"
              label="Introdução"
              rows="4"
              variant="outlined"
              prepend-inner-icon="mdi-text-box-outline"
              density="comfortable"
              class="mb-3"
            ></v-textarea>
            <v-textarea
              v-model="form.conteudo"
              label="Conteúdo"
              rows="4"
              variant="outlined"
              prepend-inner-icon="mdi-text-long"
              density="comfortable"
            ></v-textarea>
          </v-col>
          <v-col cols="12" md="6">
            <v-textarea
              v-model="form.citacao"
              label="Citação"
              rows="4"
              variant="outlined"
              prepend-inner-icon="mdi-format-quote-close"
              density="comfortable"
              class="mb-3"
            ></v-textarea>
            <v-textarea
              v-model="form.conclusao"
              label="Conclusão"
              rows="4"
              variant="outlined"
              prepend-inner-icon="mdi-check-circle-outline"
              density="comfortable"
            ></v-textarea>
          </v-col>
        </v-row>
      </div>

      <!-- Images Section -->
      <div class="mb-6">
        <h3 class="text-h6 font-weight-medium mb-4 text-primary">
          <v-icon icon="mdi-image" class="me-2" size="small"></v-icon>
          Imagens
        </h3>
        <v-row>
          <v-col cols="12" md="6">
            <v-card class="pa-4 upload-card" elevation="1">
              <v-card-subtitle class="pa-0 mb-3 text-primary font-weight-medium">
                <v-icon icon="mdi-image-outline" class="me-2" size="small"></v-icon>
                Imagem do Artigo
              </v-card-subtitle>
              
              <div v-if="imagePreview.imagem && !editingImage.imagem" class="text-center">
                <v-img :src="imagePreview.imagem" max-height="200" class="mb-3 rounded"></v-img>
                <v-btn @click="editingImage.imagem = true" color="primary" variant="outlined" size="small">
                  Alterar Imagem
                </v-btn>
              </div>
              
              <v-file-upload v-else
                v-model="form.imagem"
                label="Selecionar imagem"
                clearable
                show-size
                accept="image/*"
                variant="outlined"
                density="comfortable"
              ></v-file-upload>
              <p class="text-caption text-medium-emphasis mt-2">Formatos aceitos: JPG, PNG, GIF (máx. 5MB)</p>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <v-card class="pa-4 upload-card" elevation="1">
              <v-card-subtitle class="pa-0 mb-3 text-primary font-weight-medium">
                <v-icon icon="mdi-panorama" class="me-2" size="small"></v-icon>
                Imagem do Banner
              </v-card-subtitle>
              
              <div v-if="imagePreview.banner && !editingImage.banner" class="text-center">
                <v-img :src="imagePreview.banner" max-height="200" class="mb-3 rounded"></v-img>
                <v-btn @click="editingImage.banner = true" color="primary" variant="outlined" size="small">
                  Alterar Banner
                </v-btn>
              </div>
              
              <v-file-upload v-else
                v-model="form.banner"
                label="Selecionar imagem"
                clearable
                show-size
                accept="image/*"
                variant="outlined"
                density="comfortable"
              ></v-file-upload>
              <p class="text-caption text-medium-emphasis mt-2">Formatos aceitos: JPG, PNG, GIF (máx. 5MB)</p>
            </v-card>
          </v-col>
        </v-row>
      </div>

      <!-- Configuration Section -->
      <div class="mb-6">
        <h3 class="text-h6 font-weight-medium mb-4 text-primary">
          <v-icon icon="mdi-cog" class="me-2" size="small"></v-icon>
          Configurações
        </h3>
        <v-row>
          <v-col cols="12" md="4">
            <v-card class="pa-4 checkbox-card" :class="{ 'selected': form.ativo }" elevation="1">
              <v-switch
                v-model="form.ativo"
                label="Ativo"
                color="primary"
                hide-details
              ></v-switch>
              <p class="text-caption text-medium-emphasis mt-2 mb-0">
                Artigo visível no sistema
              </p>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card class="pa-4 checkbox-card" :class="{ 'selected': form.isMobile }" elevation="1">
              <v-switch
                v-model="form.isMobile"
                label="Mobile"
                color="success"
                hide-details
              ></v-switch>
              <p class="text-caption text-medium-emphasis mt-2 mb-0">
                Visível em dispositivos móveis
              </p>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card class="pa-4 checkbox-card" :class="{ 'selected': form.isDesktop }" elevation="1">
              <v-switch
                v-model="form.isDesktop"
                label="Desktop"
                color="info"
                hide-details
              ></v-switch>
              <p class="text-caption text-medium-emphasis mt-2 mb-0">
                Visível em dispositivos desktop
              </p>
            </v-card>
          </v-col>
        </v-row>
      </div>

      <!-- Actions -->
      <v-divider class="mb-6"></v-divider>
      <div class="d-flex justify-end ga-3">
        <v-btn
          variant="outlined"
          size="large"
          @click="router.push('/artigos/')"
        >
          Cancelar
        </v-btn>
        <v-btn
          color="primary"
          size="large"
          :disabled="!isFormValid"
          prepend-icon="mdi-eye"
          @click="showPreviewForm"
        >
          {{ props.id ? 'Próximo: Visualizar' : 'Criar Artigo' }}
        </v-btn>
      </div>
    </v-form>
  </v-card-text>
</v-card>

  <!-- Prévia do Artigo -->
  <v-card v-else class="form-card" elevation="4">
    <v-card-title class="pa-6 pb-4">
      <div class="d-flex align-center justify-space-between">
        <div class="d-flex align-center">
          <v-icon icon="mdi-eye" class="me-2" color="primary"></v-icon>
          <span class="text-h6 font-weight-medium">Prévia do Artigo</span>
        </div>
        <v-btn-toggle v-model="currentLanguage" mandatory>
          <v-btn value="pt" size="small">PT</v-btn>
          <v-btn value="en" size="small">EN</v-btn>
        </v-btn-toggle>
      </div>
    </v-card-title>

    <v-divider></v-divider>

    <v-card-text class="pa-6">
      <v-form ref="previewFormRef">
        <!-- Informações Básicas -->
        <div class="mb-6">
          <h3 class="text-h6 font-weight-medium mb-4 text-primary">
            <v-icon icon="mdi-information" class="me-2" size="small"></v-icon>
            Informações Básicas ({{ currentLanguage.toUpperCase() }})
          </h3>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="previewData[currentLanguage].titulo"
                label="Título"
                variant="outlined"
                prepend-inner-icon="mdi-format-title"
                density="comfortable"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="previewData[currentLanguage].subTitulo"
                label="Subtítulo"
                variant="outlined"
                prepend-inner-icon="mdi-format-header-2"
                density="comfortable"
              ></v-text-field>
            </v-col>
          </v-row>
        </div>

        <!-- Conteúdo -->
        <div class="mb-6">
          <h3 class="text-h6 font-weight-medium mb-4 text-primary">
            <v-icon icon="mdi-text" class="me-2" size="small"></v-icon>
            Conteúdo ({{ currentLanguage.toUpperCase() }})
          </h3>
          <v-row>
            <v-col cols="12" md="6">
              <v-textarea
                v-model="previewData[currentLanguage].introducao"
                label="Introdução"
                rows="4"
                variant="outlined"
                prepend-inner-icon="mdi-text-box-outline"
                density="comfortable"
                class="mb-3"
              ></v-textarea>
              <v-textarea
                v-model="previewData[currentLanguage].conteudo"
                label="Conteúdo"
                rows="4"
                variant="outlined"
                prepend-inner-icon="mdi-text-long"
                density="comfortable"
              ></v-textarea>
            </v-col>
            <v-col cols="12" md="6">
              <v-textarea
                v-model="previewData[currentLanguage].citacao"
                label="Citação"
                rows="4"
                variant="outlined"
                prepend-inner-icon="mdi-format-quote-close"
                density="comfortable"
                class="mb-3"
              ></v-textarea>
              <v-textarea
                v-model="previewData[currentLanguage].conclusao"
                label="Conclusão"
                rows="4"
                variant="outlined"
                prepend-inner-icon="mdi-check-circle-outline"
                density="comfortable"
              ></v-textarea>
            </v-col>
          </v-row>
        </div>

        <!-- Actions -->
        <v-divider class="mb-6"></v-divider>
        <div class="d-flex justify-space-between">
          <v-btn
            variant="outlined"
            size="large"
            prepend-icon="mdi-arrow-left"
            @click="showPreview = false"
          >
            Voltar ao Formulário
          </v-btn>
          <v-btn
            color="primary"
            size="large"
            :loading="loading"
            prepend-icon="mdi-check"
            @click="submitForm"
          >
            {{ props.id ? 'Atualizar Artigo' : 'Confirmar e Criar' }}
          </v-btn>
        </div>
      </v-form>
    </v-card-text>
  </v-card>
</div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import artigoService from '@/services/artigo/artigo-service'
import categoriaArtigoService from '@/services/categoria-artigo/categoria-artigo-service'
import 'vue3-toastify/dist/index.css';

const props = defineProps({
  id: String
})


const router = useRouter()
const loading = ref(false)
const formRef = ref(null)
const previewFormRef = ref(null)
const categoriasArtigo = ref([])
const categoriasArtigoSelected = ref("")
const showPreview = ref(false)
const currentLanguage = ref('en')

const form = ref({
  titulo: '',
  subTitulo: '',
  introducao: '',
  conteudo: '',
  citacao: '',
  conclusao: '',
  imagem: null,
  banner: null,
  ativo: true,
  isMobile: false,
  isDesktop: true,
  categoriaArtigoId: '',
})

const imagePreview = ref({
  imagem: null,
  banner: null
})

const editingImage = ref({
  imagem: false,
  banner: false
})

const previewData = ref({
  pt: {
    titulo: '',
    subTitulo: '',
    introducao: '',
    conteudo: '',
    citacao: '',
    conclusao: ''
  },
  en: {
    titulo: '',
    subTitulo: '',
    introducao: '',
    conteudo: '',
    citacao: '',
    conclusao: ''
  }
})

const rules = {
  required: (value) => !!value || 'Campo obrigatório'
}

const isFormValid = computed(() => {
  const hasImages = props.id ?
    (imagePreview.value.imagem || form.value.imagem) && (imagePreview.value.banner || form.value.banner) :
    form.value.imagem && form.value.banner

  return form.value.titulo &&
    form.value.subTitulo &&
    categoriasArtigoSelected.value.id &&
    hasImages
})

const showPreviewForm = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  previewData.value.pt = {
    titulo: form.value.titulo,
    subTitulo: form.value.subTitulo,
    introducao: form.value.introducao,
    conteudo: form.value.conteudo,
    citacao: form.value.citacao,
    conclusao: form.value.conclusao
  }

  // Se não há dados em inglês carregados, inicializar campos vazios
  if (!previewData.value.en.titulo) {
    previewData.value.en = {
      titulo: '',
      subTitulo: '',
      introducao: '',
      conteudo: '',
      citacao: '',
      conclusao: ''
    }
  }

  showPreview.value = true
}



const submitForm = async () => {
  loading.value = true
  try {
    const formData = new FormData()
    
    // Dados PT-BR
    formData.append('titulo', previewData.value.pt.titulo)
    formData.append('subTitulo', previewData.value.pt.subTitulo)
    formData.append('introducao', previewData.value.pt.introducao || '')
    formData.append('conteudo', previewData.value.pt.conteudo || '')
    formData.append('citacao', previewData.value.pt.citacao || '')
    formData.append('conclusao', previewData.value.pt.conclusao || '')

    // Dados EN
    formData.append('en_titulo', previewData.value.en.titulo)
    formData.append('en_subTitulo', previewData.value.en.subTitulo)
    formData.append('en_introducao', previewData.value.en.introducao || '')
    formData.append('en_conteudo', previewData.value.en.conteudo || '')
    formData.append('en_citacao', previewData.value.en.citacao || '')
    formData.append('en_conclusao', previewData.value.en.conclusao || '')

    // Configurações
    formData.append('ativo', form.value.ativo.toString())
    formData.append('isMobile', form.value.isMobile.toString())
    formData.append('isDesktop', form.value.isDesktop.toString())
    formData.append('categoriaArtigoId', categoriasArtigoSelected.value.id)

    if (form.value.imagem) {
      formData.append('imagem', form.value.imagem)
    }
    if (form.value.banner) {
      formData.append('banner', form.value.banner)
    }

    if (props.id) {
      await artigoService.updateArtigo(props.id, formData)
      toast.success('Artigo atualizado com sucesso!')
    } else {
      await artigoService.createArtigo(formData)
      toast.success('Artigo atualizado com sucesso!')
    }

    setTimeout(() => {
      router.push('/artigos/')
    }, 2500)

  } catch (error) {
    toast.error(props.id ? 'Erro ao atualizar artigo' : 'Erro ao criar artigo')
    console.error('Error submitting artigo:', error)
  } finally {
    loading.value = false
  }
}


const loadArtigo = async () => {
  if (!props.id) return

  try {
    const response = await artigoService.getArtigosById(props.id)
    const artigo = response.data

    form.value = {
      titulo: artigo.titulo || '',
      subTitulo: artigo.subTitulo || '',
      introducao: artigo.introducao || '',
      conteudo: artigo.conteudo || '',
      citacao: artigo.citacao || '',
      conclusao: artigo.conclusao || '',
      imagem: null,
      banner: null,
      ativo: artigo.ativo,
      isMobile: artigo.isMobile,
      isDesktop: artigo.isDesktop,
      categoriaArtigoId: artigo.categoriaArtigoId || ''
    }

    // Carregar dados de tradução se existirem
    previewData.value.pt = {
      titulo: artigo.titulo || '',
      subTitulo: artigo.subTitulo || '',
      introducao: artigo.introducao || '',
      conteudo: artigo.conteudo || '',
      citacao: artigo.citacao || '',
      conclusao: artigo.conclusao || ''
    }

    previewData.value.en = {
      titulo: artigo.en_titulo || '',
      subTitulo: artigo.en_subTitulo || '',
      introducao: artigo.en_introducao || '',
      conteudo: artigo.en_conteudo || '',
      citacao: artigo.en_citacao || '',
      conclusao: artigo.en_conclusao || ''
    }

    categoriasArtigoSelected.value = artigo.categoriaArtigo || ''

    // Definir previews das imagens
    imagePreview.value.imagem = artigo.imagensArtigo.find(img => img.isBanner === false)?.imagemUrl || null
    imagePreview.value.banner = artigo.imagensArtigo.find(img => img.isBanner === true)?.imagemUrl || null
  } catch (error) {
    toast.error('Erro ao carregar artigo')
  }
}

watch(() => props.id, (newId) => {
  if (newId) {
    loadArtigo()
  }
})

onMounted(async () => {
  try {
    const response = await categoriaArtigoService.getAllCategoriasArtigo()
    categoriasArtigo.value = response.data || []
  } catch (error) {
    console.error('Erro ao carregar categorias:', error)
  }

  if (props.id) {
    await loadArtigo()
  }
})
</script>

<style scoped>
.form-card {
  border-radius: 16px;
  overflow: hidden;
}

.checkbox-card {
  border-radius: 12px;
  transition: all 0.3s ease;
  cursor: pointer;
  border: 2px solid transparent;
}

.checkbox-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.checkbox-card.selected {
  border-color: rgb(var(--v-theme-primary));
  background-color: rgba(var(--v-theme-primary), 0.05);
}

.upload-card {
  border-radius: 12px;
  transition: all 0.3s ease;
}

.upload-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

@media (max-width: 600px) {
  .upload-card {
    margin-bottom: 1rem;
  }
}
</style>
