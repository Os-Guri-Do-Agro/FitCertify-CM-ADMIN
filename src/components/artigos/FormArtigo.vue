<template>
  <v-card class="form-card" elevation="4">
    <v-card-title class="pa-6 pb-4">
      <div class="d-flex align-center">
        <v-icon icon="mdi-form-select" class="me-2" color="primary"></v-icon>
        <span class="text-h6 font-weight-medium">Informações do Artigo</span>
      </div>
    </v-card-title>
    
    <v-divider></v-divider>
    
    <v-card-text class="pa-6">
      <v-form ref="formRef" @submit.prevent="submitForm">
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
            :loading="loading"
            :disabled="!isFormValid"
            prepend-icon="mdi-check"
            @click="submitForm"
          >
            Criar Artigo
          </v-btn>
        </div>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import artigoService from '@/services/artigo/artigo-service'
import categoriaArtigoService from '@/services/categoria-artigo/categoria-artigo-service'
import 'vue3-toastify/dist/index.css';

const router = useRouter()
const loading = ref(false)
const formRef = ref(null)
const categoriasArtigo = ref([])
const categoriasArtigoSelected = ref("")
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

const rules = {
  required: (value) => !!value || 'Campo obrigatório'
}

const isFormValid = computed(() => {
  return form.value.titulo &&
    form.value.subTitulo &&
    categoriasArtigoSelected.value.id &&
    form.value.imagem &&
    form.value.banner
})

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

    toast.success('Artigo criado com sucesso!')
    setTimeout(() => {
      router.push('/artigos/')
    }, 2000)

  } catch (error) {
    toast.error('Erro ao criar artigo')
    console.error('Error creating artigo:', error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  const response = await categoriaArtigoService.getAllCategoriasArtigo()
  categoriasArtigo.value = response.data || []
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
