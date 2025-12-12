<template>
  <v-card class="form-card" elevation="4">
    <v-card-title class="pa-6 pb-4">
      <div>
        <v-tabs v-model="mainTab">
          <v-tab value="criarArtigo" prepend-icon="mdi-form-select" color="success" class="text-primary">Criar Artigo</v-tab>
          <v-tab value="criarCategoria" prepend-icon="mdi-tag-plus" color="success" class="text-primary">Criar Categoria</v-tab>
        </v-tabs>
      </div>
    </v-card-title>

    <v-divider></v-divider>

    <v-tabs-window v-model="mainTab">
      <v-tabs-window-item value="criarArtigo">
        <v-card-text class="pa-6">
      <v-form ref="formRef" @submit.prevent="submitForm">
        <!-- Basic Information Section -->
        <div class="mb-6">
          <v-sheet class="d-flex justify-space-between mb-6">
            <div>
              <h3 v-if="tab === 'one'" class="text-h6 font-weight-medium mb-4 text-primary">
                <v-icon icon="mdi-information" class="me-2" size="small"></v-icon>
                Informações Básicas
              </h3>
              <h3 v-if="tab === 'two'" class="text-h6 font-weight-medium mb-4 text-primary">
                <v-icon icon="mdi-information" class="me-2" size="small"></v-icon>
                Informações Básicas (EN)
              </h3>
            </div>
            <div>
              <v-tabs v-model="tab">
                <v-tab value="one"><v-img src="/br-flag.png" :width="20" cover class="mr-2"></v-img> PT</v-tab>
                <v-tab value="two"><v-img src="/en-flag.png" :width="20" cover class="mr-2"></v-img> EN</v-tab>
              </v-tabs>
            </div>
          </v-sheet>

          <v-tabs-window v-model="tab">
            <v-tabs-window-item value="one">
              <v-row>
                <v-col class="mt-2" cols="12" md="6">
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
                <v-col class="mt-2" cols="12" md="6">
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
                    :loading="loadingCategorias"
                  ></v-combobox>
                </v-col>
              </v-row>
            </v-tabs-window-item>

            <v-tabs-window-item value="two">
              <v-row>
                <v-col class="mt-2" cols="12" md="6">
                  <v-text-field
                    v-model="form.en_titulo"
                    label="Título"
                    variant="outlined"
                    prepend-inner-icon="mdi-format-title"
                    :rules="[rules.required]"
                    required
                    density="comfortable"
                  ></v-text-field>
                  <v-text-field
                  class="mt-2"
                    v-model="form.en_subTitulo"
                    label="Subtítulo"
                    variant="outlined"
                    prepend-inner-icon="mdi-format-header-2"
                    :rules="[rules.required]"
                    required
                    density="comfortable"
                  ></v-text-field>
                </v-col>
                <v-col class="mb-6 d-flex items-center flex-column mt-md-2" cols="12" md="4">
                  <v-btn prepend-icon="mdi-translate" color="primary" size="large" elevation="0" @click="traduzirCampos" :loading="loadingTranslation">
                    Traduzir
                  </v-btn>
                  <v-chip class="d-flex items-center justify-center mt-3" color="orange">
                    <v-icon class="mr-2" size="24">mdi-information</v-icon>
                    <span>A tradução pode não ser 100% precisa.</span>
                  </v-chip>
                </v-col>
              </v-row>
            </v-tabs-window-item>
          </v-tabs-window>
        </div>

        <!-- Content Section -->
        <div class="mb-6">
          <v-sheet class="d-flex justify-space-between mb-6">
            <div>
              <h3 v-if="tab === 'one'" class="text-h6 font-weight-medium mb-4 text-primary">
                <v-icon icon="mdi-text" class="me-2" size="small"></v-icon>
                Conteúdo
              </h3>
              <h3 v-if="tab === 'two'" class="text-h6 font-weight-medium mb-4 text-primary">
                <v-icon icon="mdi-text" class="me-2" size="small"></v-icon>
                Conteúdo (EN)
              </h3>
            </div>
          </v-sheet>

          <v-tabs-window v-model="tab">
            <v-tabs-window-item value="one">
              <v-row class="mt-2">
                <v-col cols="12" md="6">
                  <v-textarea
                    v-model="form.introducao"
                    label="Introdução"
                    rows="4"
                    variant="outlined"
                    prepend-inner-icon="mdi-text-box-outline"
                    density="comfortable"
                  ></v-textarea>
                  <v-textarea
                  class="mt-2"
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
            </v-tabs-window-item>

            <v-tabs-window-item value="two">
              <v-row>
                <v-col class="mt-2" cols="12" md="6">
                  <v-textarea
                    v-model="form.en_introducao"
                    label="Introdução"
                    rows="4"
                    variant="outlined"
                    prepend-inner-icon="mdi-text-box-outline"
                    density="comfortable"
                    class="mb-3"
                  ></v-textarea>
                  <v-textarea
                    v-model="form.en_conteudo"
                    label="Conteúdo"
                    rows="4"
                    variant="outlined"
                    prepend-inner-icon="mdi-text-long"
                    density="comfortable"
                  ></v-textarea>
                </v-col>
                <v-col class="mt-2" cols="12" md="6">
                  <v-textarea
                    v-model="form.en_citacao"
                    label="Citação"
                    rows="4"
                    variant="outlined"
                    prepend-inner-icon="mdi-format-quote-close"
                    density="comfortable"
                    class="mb-3"
                  ></v-textarea>
                  <v-textarea
                    v-model="form.en_conclusao"
                    label="Conclusão"
                    rows="4"
                    variant="outlined"
                    prepend-inner-icon="mdi-check-circle-outline"
                    density="comfortable"
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-tabs-window-item>
          </v-tabs-window>
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
                <v-file-upload
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
                <v-file-upload
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
            :loading="loading"
            prepend-icon="mdi-check"
            @click="submitForm"
          >
            Criar Artigo
          </v-btn>
        </div>
      </v-form>
    </v-card-text>
      </v-tabs-window-item>

      <v-tabs-window-item value="criarCategoria">
        <FormCategoriaArtigo @categoria-artigo-saved="onCategoriaArtigoSaved" />
      </v-tabs-window-item>
    </v-tabs-window>

  </v-card>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import artigoService from '@/services/artigo/artigo-service'
import categoriaArtigoService from '@/services/categoria-artigo/categoria-artigo-service'
import FormCategoriaArtigo from '@/components/artigos/FormCategoriaArtigo.vue'
import 'vue3-toastify/dist/index.css';

const mainTab = ref('criarArtigo')
const tab = ref('one')
const router = useRouter()
const loading = ref(false)
const loadingTranslation = ref(false)
const loadingCategorias = ref(false)
const formRef = ref(null)
const categoriasArtigo = ref([])
const categoriasArtigoSelected = ref("")
let intervalId = null

const form = ref({
  titulo: '',
  subTitulo: '',
  introducao: '',
  conteudo: '',
  citacao: '',
  conclusao: '',
  en_titulo: '',
  en_subTitulo: '',
  en_introducao: '',
  en_conteudo: '',
  en_citacao: '',
  en_conclusao: '',
  imagem: null,
  banner: null,
  ativo: true,
  isMobile: false,
  isDesktop: true,
  categoriaArtigoId: '',
})

const rules = {
  required: (value) => !!value || 'Campo obrigatório'
}

const isFormValid = computed(() => {
  return form.value.titulo &&
    form.value.subTitulo &&
    form.value.en_titulo &&
    form.value.en_subTitulo &&
    categoriasArtigoSelected.value.id &&
    form.value.imagem &&
    form.value.banner
})

const traduzirCampos = async () => {
  if (!form.value.titulo && !form.value.subTitulo && !form.value.introducao && !form.value.conteudo && !form.value.citacao && !form.value.conclusao) {
    toast.error('Preencha pelo menos um campo para traduzir')
    return
  }

  loadingTranslation.value = true
  try {
    if (form.value.titulo) {
      form.value.en_titulo = await traduzirTexto('pt', 'en', form.value.titulo)
    }
    if (form.value.subTitulo) {
      form.value.en_subTitulo = await traduzirTexto('pt', 'en', form.value.subTitulo)
    }
    if (form.value.introducao) {
      form.value.en_introducao = await traduzirTexto('pt', 'en', form.value.introducao)
    }
    if (form.value.conteudo) {
      form.value.en_conteudo = await traduzirTexto('pt', 'en', form.value.conteudo)
    }
    if (form.value.citacao) {
      form.value.en_citacao = await traduzirTexto('pt', 'en', form.value.citacao)
    }
    if (form.value.conclusao) {
      form.value.en_conclusao = await traduzirTexto('pt', 'en', form.value.conclusao)
    }
    toast.success('Tradução concluída!')
  } catch (error) {
    toast.error('Erro ao traduzir campos')
    console.error('Translation error:', error)
  } finally {
    loadingTranslation.value = false
  }
}

const submitForm = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  loading.value = true
  try {
    const formData = new FormData()

    formData.append('titulo', form.value.titulo)
    formData.append('subTitulo', form.value.subTitulo)
    formData.append('introducao', form.value.introducao || '')
    formData.append('conteudo', form.value.conteudo || '')
    formData.append('citacao', form.value.citacao || '')
    formData.append('conclusao', form.value.conclusao || '')

    formData.append('en_titulo', form.value.en_titulo)
    formData.append('en_subTitulo', form.value.en_subTitulo)
    formData.append('en_introducao', form.value.en_introducao || '')
    formData.append('en_conteudo', form.value.en_conteudo || '')
    formData.append('en_citacao', form.value.en_citacao || '')
    formData.append('en_conclusao', form.value.en_conclusao || '')

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

    await artigoService.createArtigo(formData)

    router.push('/artigos/').then(() => {
      toast.success('Artigo criado com sucesso!')
    })

  } catch (error) {
    toast.error('Erro ao criar artigo')
    console.error('Error creating artigo:', error)
  } finally {
    loading.value = false
  }
}

const traduzirTexto = async (sourceLanguage = 'pt', targetLanguage = 'en', content) => {
  if (!content || content.trim() === '') return ''

  try {
    const response  = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY}`, {
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

const loadCategorias = async (showLoading = false) => {
  if (showLoading) loadingCategorias.value = true
  try {
    const response = await categoriaArtigoService.getAllCategoriasArtigo()
    categoriasArtigo.value = response.data || []
  } catch (error) {
    console.error('Erro ao carregar categorias:', error)
  } finally {
    if (showLoading) loadingCategorias.value = false
  }
}

const onCategoriaArtigoSaved = () => {
  loadCategorias(true)
}

watch(mainTab, (newTab) => {
  if (newTab === 'criarArtigo') {
    loadCategorias()
  }
})

onMounted(async () => {
  await loadCategorias(true)
  intervalId = setInterval(() => loadCategorias(false), 30000)
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
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
