<template>
  <v-card class="form-card" elevation="2">
    <v-card-text class="pa-8">
      <v-form ref="formRef">
        <!-- Basic Information Section -->
        <div class="mb-6">
          <h3 class="text-h6 font-weight-medium mb-4 text-primary">
            <v-icon icon="mdi-information" class="me-2" size="small"></v-icon>
            Informações Básicas
          </h3>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.nome"
                label="Nome do Afiliado"
                variant="outlined"
                :rules="[rules.required]"
                prepend-inner-icon="mdi-account"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.linkRedirect"
                label="Link de Redirecionamento"
                variant="outlined"
                prepend-inner-icon="mdi-link"
                placeholder="https://exemplo.com"
              ></v-text-field>
            </v-col>
          </v-row>
        </div>

        <!-- Image Upload Section -->
        <div class="mb-6">
          <h3 class="text-h6 font-weight-medium mb-4 text-primary">
            <v-icon icon="mdi-image" class="me-2" size="small"></v-icon>
            Imagem do Afiliado
          </h3>
          <v-row>
            <v-col cols="12">
              <div
                class="upload-area"
                :class="{ 'drag-over': dragOver }"
                @click="fileInput?.click()"
                @dragover.prevent="dragOver = true"
                @dragleave.prevent="dragOver = false"
                @drop.prevent="handleDrop"
              >
                <div v-if="!imagePreview" class="upload-content">
                  <v-icon icon="mdi-cloud-upload" size="48" class="text-medium-emphasis mb-4"></v-icon>
                  <h4 class="text-h6 mb-2">Arraste uma imagem ou clique para selecionar</h4>
                  <p class="text-body-2 text-medium-emphasis">Formatos aceitos: JPG, PNG, GIF</p>
                </div>
                <div v-else class="preview-content">
                  <v-img :src="imagePreview" class="preview-image" cover></v-img>
                  <div class="preview-overlay">
                    <v-btn
                      icon="mdi-delete"
                      color="error"
                      size="small"
                      @click.stop="removeImage"
                    ></v-btn>
                  </div>
                </div>
              </div>
              <input ref="fileInput" type="file" accept="image/*" @change="handleFileSelect" style="display: none">
              <p class="text-caption text-medium-emphasis mt-2">Formatos aceitos: JPG, PNG, GIF (máx. 5MB)</p>
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
              <v-card class="pa-4 checkbox-card" :class="{ 'selected': form.isPatrocinador }" elevation="1">
                <v-checkbox
                  v-model="form.isPatrocinador"
                  label="Patrocinador"
                  color="primary"
                  @change="onPatrocinadorChange"
                  hide-details
                ></v-checkbox>
                <p class="text-caption text-medium-emphasis mt-2 mb-0">
                  Empresa que oferece patrocínio
                </p>
              </v-card>
            </v-col>
            <v-col cols="12" md="4">
              <v-card class="pa-4 checkbox-card" :class="{ 'selected': form.isApoiador }" elevation="1">
                <v-checkbox
                  v-model="form.isApoiador"
                  label="Apoiador"
                  color="success"
                  @change="onApoiadorChange"
                  hide-details
                ></v-checkbox>
                <p class="text-caption text-medium-emphasis mt-2 mb-0">
                  Empresa que oferece apoio
                </p>
              </v-card>
            </v-col>
            <v-col cols="12" md="4">
              <v-card class="pa-4 checkbox-card" :class="{ 'selected': form.ativo }" elevation="1">
                <v-checkbox
                  v-model="form.ativo"
                  label="Ativo"
                  color="info"
                  hide-details
                ></v-checkbox>
                <p class="text-caption text-medium-emphasis mt-2 mb-0">
                  Afiliado visível no sistema
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
            @click="$router.push('/afiliados')"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="primary"
            size="large"
            :loading="loading"
            prepend-icon="mdi-check"
            @click="editAfiliado"
          >
            Atualizar Afiliado
          </v-btn>
        </div>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import afiliadoService from '@/services/afiliados'

const props = defineProps<{
  id?: string
}>()

const router = useRouter()
const loading = ref(false)
const formRef = ref()

const form = ref({
  nome: '',
  file: null as File | null,
  linkRedirect: '',
  ativo: true,
  isPatrocinador: false,
  isApoiador: false
})

const rules = {
  required: (value: string) => !!value || 'Campo obrigatório'
}

const dragOver = ref(false)
const imagePreview = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

const onPatrocinadorChange = () => {
  if (form.value.isPatrocinador) {
    form.value.isApoiador = false
  }
}

const onApoiadorChange = () => {
  if (form.value.isApoiador) {
    form.value.isPatrocinador = false
  }
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Arquivo muito grande. Máximo 5MB.')
      return
    }
    form.value.file = file
    createImagePreview(file)
  }
}

const handleDrop = (event: DragEvent) => {
  dragOver.value = false
  if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
    const file = event.dataTransfer.files[0]
    if (file.type.startsWith('image/')) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Arquivo muito grande. Máximo 5MB.')
        return
      }
      form.value.file = file
      createImagePreview(file)
    } else {
      toast.error('Por favor, selecione apenas imagens.')
    }
  }
}

const createImagePreview = (file: File) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

const removeImage = () => {
  form.value.file = null
  imagePreview.value = null
}

const loadAfiliado = async () => {
  if (!props.id) return
  
  try {
    const response = await afiliadoService.getAfiliadoById(props.id)
    const afiliado = response.data
    
    form.value = {
      nome: afiliado.nome || '',
      file: null,
      linkRedirect: afiliado.linkRedirect || '',
      ativo: afiliado.ativo,
      isPatrocinador: afiliado.isPatrocinador,
      isApoiador: afiliado.isApoiador
    }
    
    if (afiliado.imagemUrl) {
      imagePreview.value = afiliado.imagemUrl
    }
  } catch (error) {
    toast.error('Erro ao carregar afiliado')
    console.error(error)
  }
}

const editAfiliado = async () => {
  loading.value = true
  try {
    if (!props.id) return

    const data = {
      nome: form.value.nome,
      file: form.value.file,
      linkRedirect: form.value.linkRedirect,
      ativo: form.value.ativo,
      isPatrocinador: form.value.isPatrocinador,
      isApoiador: form.value.isApoiador
    }
    await afiliadoService.editarAfiliado(props.id, data)
    toast.success('Afiliado editado com sucesso!')
    setTimeout(() => {
      router.push('/afiliados')
    }, 2000)
  } catch (error) {
    toast.error('Erro ao editar afiliado')
    console.error(error)
  } finally {
    loading.value = false
  }
}

watch(
  () => props.id,
  (newId) => {
    if (newId) {
      loadAfiliado()
    }
  }
)

onMounted(() => {
  loadAfiliado()
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

.upload-area {
  border: 2px dashed #ccc;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.upload-area:hover {
  border-color: rgb(var(--v-theme-primary));
  background-color: rgba(var(--v-theme-primary), 0.05);
}

.upload-area.drag-over {
  border-color: rgb(var(--v-theme-primary));
  background-color: rgba(var(--v-theme-primary), 0.1);
  transform: scale(1.02);
}

.upload-content {
  width: 100%;
}

.preview-content {
  position: relative;
  width: 100%;
  height: 200px;
}

.preview-image {
  width: 100%;
  height: 100%;
  border-radius: 8px;
}

.preview-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.preview-content:hover .preview-overlay {
  opacity: 1;
}

@media (max-width: 600px) {
  .upload-area {
    padding: 1.5rem;
    min-height: 150px;
  }
}
</style>