<template>
  <v-card class="pa-6">
    <v-card-title class="text-h5 mb-4">Criar Novo Artigo</v-card-title>

    <v-form ref="formRef" @submit.prevent="submitForm">

      <v-row>

        <v-col cols="6">
          <v-text-field v-model="form.titulo" label="Título" :rules="[rules.required]" variant="outlined"
            class="mb-3"></v-text-field>
          <v-text-field v-model="form.subTitulo" label="Subtítulo" :rules="[rules.required]" variant="outlined"
            class="mb-3"></v-text-field>
          <v-col>
            <v-card variant="outlined" class="pa-4 ">
              <v-card-subtitle class="pa-0 mb-3">Imagem do Artigo</v-card-subtitle>
              <v-file-upload v-model="form.imagem" label="Selecionar imagem" clearable show-size accept="image/*"
                variant="outlined"></v-file-upload>
            </v-card>
          </v-col>
          <v-col>
            <v-card variant="outlined" class="pa-4 h-100">
              <v-card-subtitle class="pa-0 mb-3">Imagem do Banner</v-card-subtitle>
              <v-file-upload v-model="form.banner" label="Selecionar imagem" clearable show-size accept="image/*"
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
        <v-col class="d-flex gap-3">
          <v-btn :disabled="!isFormValid" @click="submitForm" color="primary" :loading="loading" size="large">
            Criar Artigo
          </v-btn>

          <v-btn variant="outlined" @click="router.push('/artigos/')" size="large">
            Cancelar
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
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
    formData.append('conteudo', form.value.conteudo || '')
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

    }, 2500)

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
