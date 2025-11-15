<template>
    <v-container fluid class="pa-6">
      <!-- Header Section -->
      <v-row class="mb-6">
        <v-col cols="12">
          <div class="d-flex flex-column flex-sm-row justify-space-between align-start align-sm-center ga-4">
            <div class="header-content">
              <h1 class="text-h3 font-weight-bold text-primary mb-2">
                <v-icon icon="mdi-store" class="me-3" size="large"></v-icon>
                Editar Afiliado
              </h1>
              <p class="text-subtitle-1 text-medium-emphasis mb-0">
                Edite um os afiliados do sistema
              </p>
            </div>
            <router-link :to="{ path: '/afiliados/' }">
              <v-btn
                color="grey-darken-1"
                variant="outlined"
                size="large"
                prepend-icon="mdi-arrow-left"
                class="back-btn"
              >
                Voltar
              </v-btn>
            </router-link>
          </div>
        </v-col>
      </v-row>
  
      <!-- Form Card -->
      <v-card class="form-card" elevation="4">
        <v-card-title class="pa-6 pb-4">
          <div class="d-flex align-center">
            <v-icon icon="mdi-form-select" class="me-2" color="primary"></v-icon>
            <span class="text-h6 font-weight-medium">Informações do Afiliado</span>
          </div>
        </v-card-title>
        
        <v-divider></v-divider>
        
        <v-card-text class="pa-6">
          <v-form @submit.prevent="submitForm">
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
                    label="Nome"
                    variant="outlined"
                    prepend-inner-icon="mdi-format-title"
                    required
                    density="comfortable"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.linkRedirect"
                    label="Link de Redirecionamento"
                    variant="outlined"
                    prepend-inner-icon="mdi-link"
                    type="url"
                    required
                    density="comfortable"
                  ></v-text-field>
                </v-col>
              </v-row>
            </div>
  
            <!-- Logo Section -->
            <div class="mb-6">
              <h3 class="text-h6 font-weight-medium mb-4 text-primary">
                <v-icon icon="mdi-image" class="me-2" size="small"></v-icon>
                Logo/Imagem
              </h3>
              <v-row>
                <v-col cols="12" md="6">
                  <div class="upload-area" :class="{ 'drag-over': dragOver }" @dragover.prevent="dragOver = true" @dragleave="dragOver = false" @drop.prevent="handleDrop">
                    <div v-if="!imagePreview" class="upload-content">
                      <v-icon icon="mdi-cloud-upload" size="48" color="primary" class="mb-3"></v-icon>
                      <h4 class="text-h6 mb-2">Arraste e solte o logo aqui</h4>
                      <p class="text-body-2 text-medium-emphasis mb-4">ou clique para selecionar</p>
                      <v-btn color="primary" variant="outlined" @click="fileInput?.click()">
                        <v-icon icon="mdi-folder-open" class="me-2"></v-icon>
                        Selecionar Arquivo
                      </v-btn>
                    </div>
                    <div v-else class="preview-content">
                      <v-img :src="imagePreview" class="preview-image" cover></v-img>
                      <div class="preview-overlay">
                        <v-btn icon="mdi-pencil" color="white" variant="elevated" size="small" @click="fileInput?.click()" class="me-2"></v-btn>
                        <v-btn icon="mdi-delete" color="error" variant="elevated" size="small" @click="removeImage"></v-btn>
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
                type="submit"
                color="primary"
                size="large"
                :loading="loading"
                prepend-icon="mdi-check"
              >
                Criar Afiliado
              </v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-container>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { toast } from 'vue3-toastify'
  import afiliadoService from '@/services/afiliados'
  
  const router = useRouter()
  const loading = ref(false)
  
  const form = ref({
    nome: '',
    file: null as File[] | null,
    linkRedirect: '',
    ativo: true,
    isPatrocinador: false,
    isApoiador: false
  })

  const editarAfiliado = async () => {
    try {
      const response = await afiliadoService.editarAfiliado(Id, form.value)
      console.log(response)
    } catch (error) {
      console.error(error)
    }
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
      form.value.file = [file]
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
        form.value.file = [file]
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
  
  const submitForm = async () => {
    loading.value = true
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success('Afiliado criado com sucesso!')
      router.push('/afiliados')
    } catch (error) {
      toast.error('Erro ao criar afiliado')
      console.error('Erro:', error)
    } finally {
      loading.value = false
    }
  }
  </script>
  
  <style scoped>
  .header-content {
    flex: 1;
  }
  
  .back-btn {
    transition: all 0.3s ease;
  }
  
  .back-btn:hover {
    transform: translateX(-4px);
  }
  
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
    .header-content h1 {
      font-size: 1.75rem !important;
    }
    
    .upload-area {
      padding: 1.5rem;
      min-height: 150px;
    }
  }
  </style>
    