<template>
  <v-card class="pa-6">
    <v-card-title class="text-h5 mb-4">{{ props.id ? 'Editar Artigo' : 'Criar Novo Artigo' }}</v-card-title>

    <v-form ref="formRef" @submit.prevent="submitForm">

      <v-row>

        <v-col cols="6">
          <v-text-field v-model="form.titulo" label="Título" :rules="[rules.required]" variant="outlined"
            class="mb-3"></v-text-field>
          <v-text-field v-model="form.subTitulo" label="Subtítulo" :rules="[rules.required]" variant="outlined"
            class="mb-3"></v-text-field>
          <v-col>
            <v-card variant="outlined" class="pa-4">
              <v-card-subtitle class="pa-0 mb-3">Imagem do Artigo</v-card-subtitle>

              <div v-if="imagePreview.imagem && !editingImage.imagem" class="text-center">
                <v-img :src="imagePreview.imagem" max-height="200" class="mb-3"></v-img>
                <v-btn @click="editingImage.imagem = true" color="primary" variant="outlined" size="small">
                  Alterar Imagem
                </v-btn>
              </div>

              <v-file-upload v-else v-model="form.imagem" label="Selecionar imagem" clearable show-size accept="image/*"
                variant="outlined"></v-file-upload>
            </v-card>
          </v-col>
          <v-col>
            <v-card variant="outlined" class="pa-4 h-100">
              <v-card-subtitle class="pa-0 mb-3">Imagem do Banner</v-card-subtitle>

              <div v-if="imagePreview.banner && !editingImage.banner" class="text-center">
                <v-img :src="imagePreview.banner" max-height="200" class="mb-3"></v-img>
                <v-btn @click="editingImage.banner = true" color="primary" variant="outlined" size="small">
                  Alterar Banner
                </v-btn>
              </div>

              <v-file-upload v-else v-model="form.banner" label="Selecionar imagem" clearable show-size accept="image/*"
                variant="outlined"></v-file-upload>
            </v-card>
          </v-col>
        </v-col>

        <v-col>
          <v-textarea v-model="form.introducao" label="Introdução" rows="4" variant="outlined"
            class="mb-3"></v-textarea>
          <v-textarea v-model="form.conteudo" label="Conteúdo" rows="4" variant="outlined" class="mb-3"></v-textarea>
          <v-textarea v-model="form.citacao" label="Citação" rows="4" variant="outlined" class="mb-3"></v-textarea>
          <v-textarea v-model="form.conclusao" label="Conclusão" rows="4" variant="outlined" class="mb-3"></v-textarea>

          <v-combobox v-model="categoriasArtigoSelected" variant="outlined" label="Categoria" :items="categoriasArtigo"
            item-title="nome" item-value="id"></v-combobox>
          <!-- <v-combobox v-model="selectedBase" :items="bases" item-title="name" label="Selecione uma base" item-value="id"
            clearable class="mb-3"></v-combobox> -->
          <v-card variant="outlined" class="pa-4">
            <v-card-subtitle class="pa-0 mb-3">Configurações</v-card-subtitle>
            <v-row>
              <v-col cols="4">
                <v-switch color="primary" v-model="form.ativo" label="Ativo"></v-switch>
              </v-col>
              <v-col cols="4">
                <v-switch color="primary" v-model="form.isMobile" label="Mobile"></v-switch>
              </v-col>
              <v-col cols="4">
                <v-switch color="primary" v-model="form.isDesktop" label="Desktop"></v-switch>
              </v-col>
            </v-row>
          </v-card>
        </v-col>


      </v-row>

      <v-divider class="my-6"></v-divider>

      <v-row>
        <v-col class="d-flex justify-space-between">

          <v-btn variant="outlined" @click="router.push('/artigos/')" size="large">
            Cancelar
          </v-btn>
          <v-btn :disabled="!isFormValid" @click="submitForm" color="primary" :loading="loading" size="large">
            {{ props.id ? 'Atualizar Artigo' : 'Criar Artigo' }}
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-card>
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

const imagePreview = ref({
  imagem: null,
  banner: null
})

const editingImage = ref({
  imagem: false,
  banner: false
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

const submitForm = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  loading.value = true
  try {

    // introducao: '',
  // conteudo: '',
  // citacao: '',
  // conclusao: '',
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
