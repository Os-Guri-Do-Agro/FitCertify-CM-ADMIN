<template>
  <v-card class="pa-6">
    <v-card-title class="text-h5 mb-4">Criar Novo Marketplace</v-card-title>

    <v-form ref="formRef" @submit.prevent="submitForm">

      <v-row>

        <v-col cols="6">
          <v-text-field v-model="form.titulo" label="Título" :rules="[rules.required]" variant="outlined"
            class="mb-3"></v-text-field>
          <v-text-field v-model="form.subTitulo" label="Subtítulo" :rules="[rules.required]" variant="outlined"
            class="mb-3"></v-text-field>
          <v-col>
            <v-card variant="outlined" class="pa-4 ">
              <v-card-subtitle class="pa-0 mb-3">Imagem do Produto</v-card-subtitle>
              <v-file-upload v-model="form.file" label="Selecionar imagem" clearable show-size accept="image/*"
                variant="outlined"></v-file-upload>
            </v-card>
          </v-col>

        </v-col>

        <v-col>
          <v-textarea v-model="form.descricao" label="Descrição" rows="4" variant="outlined" class="mb-3"></v-textarea>
          <v-textarea v-model="form.orientacao" label="Orientação " rows="4" variant="outlined" class="mb-3"></v-textarea>
          <v-combobox v-model="categoriasProdutoSelected" variant="outlined" label="Categoria" :items="categoriasProduto"
            item-title="nome" item-value="id"></v-combobox>
          <v-combobox v-model="categoriasEmpresaSelected" variant="outlined" label="Empresa" :items="categoriasEmpresa"
            item-title="nome" item-value="id"></v-combobox>
          <!-- <v-combobox v-model="selectedBase" :items="bases" item-title="name" label="Selecione uma base" item-value="id"
            clearable class="mb-3"></v-combobox> -->
          <v-card variant="outlined" class="pa-2  ">
            <v-card-subtitle class="pa-0 mb-3">Configurações</v-card-subtitle>
            <v-row>
              <v-col cols="2">

                <v-switch color="primary" v-model="form.ativo" label="Ativo"></v-switch>
              </v-col>
              <v-col cols="4">
                <v-switch color="primary" v-model="form.condicaoEspecial" label="Condição Especial"></v-switch>
              </v-col>
              <v-col cols="6">
                <v-switch color="primary" v-model="form.exclusivoParaCertificado" label="Exclusivo para Certificado"></v-switch>
              </v-col>
           <v-col cols="6">
              <v-text-field v-model="form.preco" label="Preço" :rules="[rules.required]" variant="outlined"
                class="mb-3"></v-text-field>

           </v-col>
             <v-col cols="6">
              <v-text-field v-model="form.desconto" label="Desconto" :rules="[rules.required]" variant="outlined"
                class="mb-3"></v-text-field>
           </v-col>

            </v-row>
          </v-card>
        </v-col>
        <v-col cols="12">

        </v-col>

      </v-row>

      <v-divider class="my-6"></v-divider>

      <v-row>
        <v-col class="d-flex  justify-space-between ">
          <v-btn variant="outlined" @click="router.push('/marketplace/')" size="large">
            Cancelar
          </v-btn>

          <v-btn :disabled="!isFormValid" @click="submitForm" color="primary" :loading="loading" size="large">
            Criar Produto
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
import produtoService from '@/services/marketplace/marketplace-service'
// import categoriaArtigoService from '@/services/categoria-artigo/categoria-artigo-service'
import empresaService from '@/services/empresa/empresa-service'
import categoriaProdutoService from '@/services/categoria-produto/categoria-produto-service'
import 'vue3-toastify/dist/index.css';


const router = useRouter()
const loading = ref(false)
const formRef = ref(null)
const categoriasProduto = ref([])
const categoriasEmpresa = ref([])
const categoriasProdutoSelected = ref("")
const categoriasEmpresaSelected = ref("")

const form = ref({
  titulo: '',
  subTitulo: '',
  descricao : '',
  orientacao : '',
  preco : null,
  desconto : null,
  file: null,
  ativo: true,
  condicaoEspecial : false,
  exclusivoParaCertificado: false,
  categoriaProdutoId: '',
  empresaId: ''
})

const rules = {
  required: (value) => !!value || 'Campo obrigatório'
}

const isFormValid = computed(() => {
  return form.value.titulo &&
  form.value.descricao &&
  form.value.subTitulo &&
  form.value.orientacao &&
    form.value.preco &&
    form.value.desconto

})

const submitForm = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  loading.value = true
  try {
    const formData = new FormData()
    formData.append('titulo', form.value.titulo)
    formData.append('subTitulo', form.value.subTitulo)
    formData.append('descricao', form.value.descricao || '')
    formData.append('orientacao', form.value.orientacao || '')
    formData.append('preco', form.value.preco || 0)
    formData.append('desconto', form.value.desconto || 0)
    formData.append('ativo', form.value.ativo.toString())
    formData.append('condicaoEspecial', form.value.condicaoEspecial.toString())
    formData.append('exclusivoParaCertificado', form.value.exclusivoParaCertificado.toString())
    formData.append('categoriaProdutoId', categoriasProdutoSelected.value.id)
    formData.append('empresaId', categoriasEmpresaSelected.value.id)

    if (form.value.file) {
      formData.append('file', form.value.file)
    }

    console.log(formData)

    await produtoService.createProduto(formData)

    toast.success('Produto criado com sucesso!')
    setTimeout(() => {
      router.push('/marketplace/')

    }, 2500)

  } catch (error) {
    toast.error('Erro ao criar Produto')
    console.error('Error creating produto:', error)
  } finally {
    loading.value = false
  }
}


onMounted(async () => {
  const responseEmpresas = await empresaService.getAllEmpresas()
  categoriasEmpresa.value = responseEmpresas.data || []
  const responseCategoriaProduto = await categoriaProdutoService.getAllCategoriasProduto()
  categoriasProduto.value = responseCategoriaProduto.data || []
  console.log(categoriasProduto.value)
})
</script>
