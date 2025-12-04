<template>
  <v-card class="form-card" elevation="4">
    <v-card-title class="pa-6 pb-4">
      <div class="d-flex align-center">
        <v-icon icon="mdi-store-edit" class="me-2" color="primary"></v-icon>
        <span class="text-h6 font-weight-medium">Editar Produto</span>
      </div>
    </v-card-title>

    <v-divider></v-divider>

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
                    label="Título do Produto"
                    variant="outlined"
                    prepend-inner-icon="mdi-tag"
                    :rules="[rules.required]"
                    required
                    density="comfortable"
                    class="mb-3"
                  ></v-text-field>
                  <v-text-field
                    v-model="form.subTitulo"
                    label="Subtítulo"
                    variant="outlined"
                    prepend-inner-icon="mdi-text"
                    :rules="[rules.required]"
                    required
                    density="comfortable"
                    class="mb-3"
                  ></v-text-field>
                  <v-textarea
                    v-model="form.descricao"
                    label="Descrição do Produto"
                    rows="3"
                    variant="outlined"
                    prepend-inner-icon="mdi-text-box-outline"
                    :rules="[rules.required]"
                    required
                    density="comfortable"
                    class="mb-3"
                  ></v-textarea>
                </v-col>
                <v-col class="mt-md-2" cols="12" md="6">
                  <v-textarea
                    v-model="form.orientacao"
                    label="Orientação"
                    rows="3"
                    variant="outlined"
                    prepend-inner-icon="mdi-information-outline"
                    :rules="[rules.required]"
                    required
                    density="comfortable"
                    class="mb-3"
                  ></v-textarea>
                  <v-combobox
                    v-model="categoriasProdutoSelected"
                    variant="outlined"
                    label="Categoria do Produto"
                    prepend-inner-icon="mdi-shape"
                    :items="categoriasProduto"
                    item-title="nome"
                    item-value="id"
                    density="comfortable"
                    class="mb-3"
                  ></v-combobox>
                  <v-combobox
                    v-model="categoriasEmpresaSelected"
                    variant="outlined"
                    label="Empresa"
                    prepend-inner-icon="mdi-domain"
                    :items="categoriasEmpresa"
                    item-title="nome"
                    item-value="id"
                    density="comfortable"
                    class="mb-3"
                  ></v-combobox>
                </v-col>
              </v-row>
            </v-tabs-window-item>

            <v-tabs-window-item value="two">
              <v-row>
                <v-col class="mt-2" cols="12" md="6">
                  <v-text-field
                    class="mb-3"
                    v-model="form.en_titulo"
                    label="Título do Produto"
                    variant="outlined"
                    prepend-inner-icon="mdi-tag"
                    :rules="[rules.required]"
                    required
                    density="comfortable"
                  ></v-text-field>
                  <v-text-field
                    class="mb-3"
                    v-model="form.en_subTitulo"
                    label="Subtítulo"
                    variant="outlined"
                    prepend-inner-icon="mdi-text"
                    :rules="[rules.required]"
                    required
                    density="comfortable"
                  ></v-text-field>
                  <v-textarea
                    v-model="form.en_descricao"
                    label="Descrição do Produto"
                    rows="3"
                    variant="outlined"
                    prepend-inner-icon="mdi-text-box-outline"
                    :rules="[rules.required]"
                    required
                    density="comfortable"
                    class="mb-3"
                  ></v-textarea>
                  <v-textarea
                    v-model="form.en_orientacao"
                    label="Orientação"
                    rows="3"
                    variant="outlined"
                    prepend-inner-icon="mdi-information-outline"
                    :rules="[rules.required]"
                    required
                    density="comfortable"
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-tabs-window-item>
          </v-tabs-window>
        </div>

        <!-- Pricing Section -->
        <div class="mb-6">
          <h3 class="text-h6 font-weight-medium mb-4 text-primary">
            <v-icon icon="mdi-currency-usd" class="me-2" size="small"></v-icon>
            Preços e Descontos
          </h3>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.preco"
                label="Preço"
                type="number"
                variant="outlined"
                prepend-inner-icon="mdi-cash"
                :rules="[rules.required]"
                required
                density="comfortable"
                class="mb-3"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.desconto"
                label="Desconto (%)"
                type="number"
                variant="outlined"
                prepend-inner-icon="mdi-percent"
                :rules="[rules.required]"
                required
                density="comfortable"
                class="mb-3"
              ></v-text-field>
            </v-col>
          </v-row>
        </div>

        <!-- Configuration Section -->
        <div class="mb-6">
          <h3 class="text-h6 font-weight-medium mb-4 text-primary">
            <v-icon icon="mdi-cog" class="me-2" size="small"></v-icon>
            Configurações do Produto
          </h3>
          <v-row>
            <v-col cols="12" md="4">
              <v-card class="pa-4 checkbox-card" :class="{ 'selected': form.ativo }" elevation="1">
                <v-switch
                  v-model="form.ativo"
                  label="Produto Ativo"
                  color="primary"
                  hide-details
                ></v-switch>
                <p class="text-caption text-medium-emphasis mt-2 mb-0">
                  Produto visível no sistema
                </p>
              </v-card>
            </v-col>
            <v-col cols="12" md="4">
              <v-card class="pa-4 checkbox-card" :class="{ 'selected': form.exclusivoParaCertificado }" elevation="1">
                <v-switch
                  v-model="form.exclusivoParaCertificado"
                  label="Exclusivo para Certificado"
                  color="success"
                  hide-details
                ></v-switch>
                <p class="text-caption text-medium-emphasis mt-2 mb-0">
                  {{ form.exclusivoParaCertificado ? 'Disponível apenas com certificado' : 'Disponível para todos' }}
                </p>
              </v-card>
            </v-col>
            <v-col cols="12" md="4">
              <v-card class="pa-4 checkbox-card" :class="{ 'selected': form.condicaoEspecial }" elevation="1">
                <v-switch
                  v-model="form.condicaoEspecial"
                  label="Condição Especial"
                  color="warning"
                  hide-details
                  disabled
                ></v-switch>
                <p class="text-caption text-medium-emphasis mt-2 mb-0">
                  {{ form.condicaoEspecial ? 'Produto com desconto ativo' : 'Sem condição especial' }}
                </p>
              </v-card>
            </v-col>
          </v-row>
        </div>

        <!-- Image Section -->
        <div class="mb-6">
          <h3 class="text-h6 font-weight-medium mb-4 text-primary">
            <v-icon icon="mdi-image" class="me-2" size="small"></v-icon>
            Imagem do Produto
          </h3>
          <v-card class="pa-4 upload-card" elevation="1">
            <v-card-subtitle class="pa-0 mb-3 text-primary font-weight-medium">
              <v-icon icon="mdi-image-outline" class="me-2" size="small"></v-icon>
              Imagem Principal
            </v-card-subtitle>
            
            <div v-if="imagePreview && !editingImage" class="text-center">
              <v-img :src="imagePreview" max-height="200" class="mb-3 rounded"></v-img>
              <v-btn @click="editingImage = true" color="primary" variant="outlined" size="small">
                Alterar Imagem
              </v-btn>
            </div>

            <div v-else>
              <v-file-upload
                v-model="form.file"
                label="Selecionar imagem"
                clearable
                show-size
                accept="image/*"
                variant="outlined"
                density="comfortable"
              ></v-file-upload>
              <p class="text-caption text-medium-emphasis mt-2">Formatos aceitos: JPG, PNG, GIF (máx. 5MB)</p>
            </div>
          </v-card>
        </div>

        <!-- Link Section -->
        <div class="mb-6">
          <h3 class="text-h6 font-weight-medium mb-4 text-primary">
            <v-icon icon="mdi-link-plus" class="me-2" size="small"></v-icon>
            Link Externo
          </h3>
          <v-alert type="info" variant="tonal" density="compact" class="mb-3">
            <div class="text-caption">
              Se existir um local externo para onde o usuário deve ir, insira aqui o link — pode ser o site da empresa ou o link de pagamento. Caso não haja, deixe em branco.
            </div>
          </v-alert>
          <v-text-field
            v-model="form.linkSiteEmpresa"
            label="Link de redirecionamento"
            variant="outlined"
            prepend-inner-icon="mdi-link"
            density="comfortable"
          ></v-text-field>
        </div>

        <!-- Actions -->
        <v-divider class="mb-6"></v-divider>
        <div class="d-flex justify-end ga-3">
          <v-btn
            variant="outlined"
            size="large"
            @click="router.push('/marketplace/')"
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
            Atualizar Produto
          </v-btn>
        </div>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import produtoService from '@/services/marketplace/marketplace-service'
import empresaService from '@/services/empresa/empresa-service'
import categoriaProdutoService from '@/services/categoria-produto/categoria-produto-service'
import marketplaceService from '@/services/marketplace/marketplace-service'
import 'vue3-toastify/dist/index.css'

const tab = ref('one')
const router = useRouter()
const loading = ref(false)
const formRef = ref(null)
const categoriasProduto = ref([])
const categoriasEmpresa = ref([])
const categoriasProdutoSelected = ref('')
const categoriasEmpresaSelected = ref('')
const imagePreview = ref(null)
const editingImage = ref(false)

const props = defineProps({
  id: String
})

const form = ref({
  titulo: '',
  en_titulo: '',
  subTitulo: '',
  en_subTitulo: '',
  descricao: '',
  en_descricao: '',
  orientacao: '',
  en_orientacao: '',
  preco: null,
  desconto: null,
  file: null,
  ativo: true,
  condicaoEspecial: false,
  exclusivoParaCertificado: false,
  categoriaProdutoId: '',
  empresaId: '',
  linkSiteEmpresa: ''
})

function condicaoEspecial() {
  if (form.value.desconto > 0) {
    form.value.condicaoEspecial = true
  } else {
    form.value.condicaoEspecial = false
  }
}

watch(() => form.value.desconto, condicaoEspecial)

const rules = {
  required: (value) => !!value || 'Campo obrigatório'
}

const isFormValid = computed(() => {
  const hasImage = props.id ? (imagePreview.value || form.value.file) : form.value.file
  
  return form.value.titulo &&
    form.value.en_titulo &&
    form.value.descricao &&
    form.value.en_descricao &&
    form.value.subTitulo &&
    form.value.en_subTitulo &&
    form.value.orientacao &&
    form.value.en_orientacao &&
    form.value.preco &&
    form.value.desconto !== null &&
    hasImage
})

const submitForm = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  loading.value = true
  try {
    const formData = new FormData()
    formData.append('titulo', form.value.titulo)
    formData.append('en_titulo', form.value.en_titulo || '')
    formData.append('subTitulo', form.value.subTitulo)
    formData.append('en_subTitulo', form.value.en_subTitulo || '')
    formData.append('descricao', form.value.descricao || '')
    formData.append('en_descricao', form.value.en_descricao || '')
    formData.append('orientacao', form.value.orientacao || '')
    formData.append('en_orientacao', form.value.en_orientacao || '')
    formData.append('preco', form.value.preco || 0)
    formData.append('desconto', form.value.desconto || 0)
    formData.append('ativo', form.value.ativo.toString())
    formData.append('condicaoEspecial', form.value.condicaoEspecial.toString())
    formData.append('exclusivoParaCertificado', form.value.exclusivoParaCertificado.toString())
    formData.append('categoriaProdutoId', categoriasProdutoSelected.value.id)
    formData.append('empresaId', categoriasEmpresaSelected.value.id)
    formData.append('linkSiteEmpresa', form.value.linkSiteEmpresa || '')

    if (form.value.file) {
      formData.append('file', form.value.file)
    }

    await produtoService.updateProduto(props.id, formData)

    router.push('/marketplace/').then(() => {
      toast.success('Produto atualizado com sucesso!')
    })
  } catch (error) {
    toast.error('Erro ao atualizar Produto')
    console.error('Error updating produto:', error)
  } finally {
    loading.value = false
  }
}

const loadProdutos = async () => {
  if (!props.id) return

  try {
    const response = await marketplaceService.getProdutosById(props.id)
    const produto = response.data

    form.value = {
      titulo: produto.titulo || '',
      en_titulo: produto.en_titulo || '',
      subTitulo: produto.subTitulo || '',
      en_subTitulo: produto.en_subTitulo || '',
      descricao: produto.descricao || '',
      en_descricao: produto.en_descricao || '',
      orientacao: produto.orientacao || '',
      en_orientacao: produto.en_orientacao || '',
      preco: produto.preco || null,
      desconto: produto.desconto || null,
      file: null,
      ativo: produto.ativo,
      condicaoEspecial: produto.condicaoEspecial || false,
      exclusivoParaCertificado: produto.exclusivoParaCertificado || false,
      categoriaProdutoId: produto.categoriaProdutoId || '',
      empresaId: produto.empresaId || '',
      linkSiteEmpresa: produto.linkSiteEmpresa || ''
    }

    imagePreview.value = produto.imagemUrl || null
    categoriasProdutoSelected.value = produto.categoriaProduto || ''
    categoriasEmpresaSelected.value = produto.empresa || ''
  } catch (error) {
    toast.error('Erro ao carregar Produto')
  }
}

watch(() => props.id, (newId) => {
  if (newId) {
    loadProdutos()
  }
})

onMounted(async () => {
  const responseEmpresas = await empresaService.getAllEmpresas()
  categoriasEmpresa.value = responseEmpresas.data || []
  const responseCategoriaProduto = await categoriaProdutoService.getAllCategoriasProduto()
  categoriasProduto.value = responseCategoriaProduto.data || []
  if (props.id) {
    await loadProdutos()
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
