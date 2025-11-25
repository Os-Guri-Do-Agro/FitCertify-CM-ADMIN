<template>
  <v-container fluid class="pa-6">
    <!-- Header Section -->
    <v-row class="mb-6">
      <v-col cols="12">
        <div class="d-flex flex-column flex-sm-row justify-space-between align-start align-sm-center ga-4">
          <div class="header-content">
            <h1 class="text-h3 font-weight-bold text-primary mb-2">
              <v-icon icon="mdi-certificate" class="me-3" size="large"></v-icon>
              Avaliar Solicitação de Certificado
            </h1>
            <p class="text-subtitle-1 text-medium-emphasis mb-0">
              Revise e avalie a solicitação de certificado
            </p>
          </div>
          <router-link :to="{ path: '/solicitacaoCertificado' }">
            <v-btn color="grey-darken-1" variant="outlined" size="large" prepend-icon="mdi-arrow-left" class="back-btn">
              Voltar
            </v-btn>
          </router-link>
        </div>
      </v-col>
    </v-row>

    <!-- Loading State -->
    <v-card v-if="loading" class="main-card" elevation="3">
      <v-card-text class="text-center pa-8">
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
        <p class="mt-4 text-body-1">Carregando dados da solicitação...</p>
      </v-card-text>
    </v-card>

    <!-- Content -->
    <template v-else-if="solicitacao">
      <v-row>
        <!-- Informações da Solicitação e Evento -->
        <v-col cols="12" md="6">
          <!-- Informações da Solicitação -->
          <v-card class="main-card mb-4" elevation="3">
            <v-card-title class="pa-6 pb-4">
              <v-icon icon="mdi-information" class="me-2" color="primary"></v-icon>
              Informações da Solicitação
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pa-6">
              <v-row>
                <v-col cols="12" md="6">
                  <div class="info-item mb-4">
                    <div class="text-caption text-medium-emphasis mb-1">Situação</div>
                    <v-chip :color="getSituacaoColor(solicitacao.situacao)"
                      :prepend-icon="getSituacaoIcon(solicitacao.situacao)" size="small" variant="flat">
                      {{ solicitacao?.situacao || 'N/A' }}
                    </v-chip>
                  </div>
                </v-col>
                <v-col cols="12" md="6" v-if="solicitacao.dataCriacao || solicitacao.createdAt">
                  <div class="info-item mb-4">
                    <div class="text-caption text-medium-emphasis mb-1">Data de Criação</div>
                    <div class="text-body-1 font-weight-medium">
                      {{ formatDate(solicitacao?.dataCriacao || solicitacao?.createdAt) }}
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" md="6" v-if="solicitacao.usuario">
                  <div class="info-item mb-4">
                    <div class="text-caption text-medium-emphasis mb-1">Usuário</div>
                    <div class="text-body-1 font-weight-medium">
                      {{ solicitacao.usuario.nome || solicitacao.usuario.email || 'N/A' }}
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" v-if="solicitacao.camposCertificado">
                  <div class="info-item mb-4">
                    <div class="text-caption text-medium-emphasis mb-1">Campos do Certificado</div>
                    <div class="text-body-1">{{ formatCamposCertificado(solicitacao.camposCertificado) }}</div>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Informações do Evento -->
          <v-card class="main-card" elevation="3" v-if="solicitacao.evento">
            <v-card-title class="pa-6 pb-4">
              <v-icon icon="mdi-calendar-star" class="me-2" color="primary"></v-icon>
              Informações do Evento
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pa-6">
              <v-row>
                <v-col cols="12">
                  <div class="info-item mb-4">
                    <div class="text-caption text-medium-emphasis mb-1">Título</div>
                    <div class="text-body-1 font-weight-medium">
                      {{ solicitacao.evento.titulo || '' }}
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" v-if="solicitacao.evento.descricao">
                  <div class="info-item mb-4">
                    <div class="text-caption text-medium-emphasis mb-1">Descrição</div>
                    <div class="text-body-2">{{ solicitacao.evento.descricao }}</div>
                  </div>
                </v-col>
                <v-col cols="12" md="6" v-if="solicitacao.evento.data">
                  <div class="info-item mb-4">
                    <div class="text-caption text-medium-emphasis mb-1">Data do Evento</div>
                    <div class="text-body-1 font-weight-medium">
                      {{ formatDate(solicitacao.evento.data) }}
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" md="6" v-if="solicitacao.evento.local">
                  <div class="info-item mb-4">
                    <div class="text-caption text-medium-emphasis mb-1">Local</div>
                    <div class="text-body-1 font-weight-medium">
                      {{ solicitacao.evento.local }}
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" md="6" v-if="solicitacao.evento.tipoEvento">
                  <div class="info-item mb-4">
                    <div class="text-caption text-medium-emphasis mb-1">Tipo de Evento</div>
                    <div class="text-body-1 font-weight-medium">
                      {{ solicitacao.evento.tipoEvento.nome || solicitacao.evento.tipoEvento || 'N/A' }}
                    </div>
                  </div>
                </v-col>
                <v-col cols="12"
                  v-if="solicitacao.evento.organizacaoEvento && solicitacao.evento.organizacaoEvento.length > 0">
                  <div class="info-item mb-4">
                    <div class="text-caption text-medium-emphasis mb-1">Organizações</div>
                    <div class="d-flex flex-wrap ga-2">
                      <v-chip v-for="(org, index) in solicitacao.evento.organizacaoEvento" :key="index" size="small"
                        variant="outlined">
                        {{ org.organizacao?.nome || org.nome || org }}
                      </v-chip>
                    </div>
                  </div>
                </v-col>
                <v-col cols="12"
                  v-if="solicitacao.evento.distanciasEvento && solicitacao.evento.distanciasEvento.length > 0">
                  <div class="info-item mb-4">
                    <div class="text-caption text-medium-emphasis mb-1">Distâncias</div>
                    <div class="d-flex flex-wrap ga-2">
                      <v-chip v-for="(dist, index) in solicitacao.evento.distanciasEvento" :key="index" size="small"
                        variant="outlined" color="primary">
                        {{ dist.distancia || dist }} km
                      </v-chip>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Arquivo -->
        <v-col cols="12" md="6">
          <v-card class="main-card" elevation="3">
            <v-card-title class="pa-6 pb-4">
              <v-icon icon="mdi-file-document" class="me-2" color="primary"></v-icon>
              Modelo de Certificado Anexado
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pa-6">
              <!-- PDF Viewer -->
              <div v-if="arquivoUrl && isPdf" class="file-viewer">
                <iframe :src="arquivoUrl" class="file-iframe" frameborder="0"></iframe>
                <div class="pdf-overlay">
                  <v-btn icon="mdi-open-in-new" size="small" color="white" variant="flat"
                    @click="openPdfDialog"></v-btn>
                </div>
              </div>
              <!-- Image Viewer -->
              <div v-else-if="arquivoUrl && isImage" class="image-viewer-container">
                <v-img :src="arquivoUrl" class="preview-image" contain @click="openImageDialog"
                  style="cursor: zoom-in;">
                  <template v-slot:placeholder>
                    <div class="d-flex align-center justify-center fill-height">
                      <v-progress-circular indeterminate color="primary"></v-progress-circular>
                    </div>
                  </template>
                </v-img>
                <div class="image-overlay">
                  <v-btn icon="mdi-magnify-plus" size="small" color="white" variant="flat"
                    @click="openImageDialog"></v-btn>
                </div>
              </div>
              <div v-else class="text-center pa-8">
                <v-icon icon="mdi-file-remove" size="64" color="grey-lighten-1" class="mb-4"></v-icon>
                <p class="text-body-1 text-medium-emphasis">Nenhum arquivo disponível</p>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Ações -->
      <v-row class="mt-4">
        <v-col cols="12">
          <v-card class="main-card" elevation="3">
            <v-card-text class="pa-6">
              <div class="d-flex flex-column flex-sm-row justify-end ga-4">
                <v-btn color="error" size="large" prepend-icon="mdi-close-circle" :loading="loadingInvalidar"
                  :disabled="loadingValidar || solicitacao.situacao?.toUpperCase() !== 'PENDENTE'"
                  @click="invalidarSolicitacao">
                  Invalidar
                </v-btn>
                <v-btn color="success" size="large" prepend-icon="mdi-check-circle" :loading="loadingValidar"
                  :disabled="loadingInvalidar || solicitacao.situacao?.toUpperCase() !== 'PENDENTE'"
                  @click="validarSolicitacao">
                  Validar
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>

    <!-- Error State -->
    <v-card v-else class="main-card" elevation="3">
      <v-card-text class="text-center pa-8">
        <v-icon icon="mdi-alert-circle" size="64" color="error" class="mb-4"></v-icon>
        <p class="text-h6 mb-2">Erro ao carregar solicitação</p>
        <p class="text-body-2 text-medium-emphasis mb-4">
          Não foi possível carregar os dados da solicitação
        </p>
        <router-link :to="{ path: '/solicitacaoCertificado' }">
          <v-btn color="primary" prepend-icon="mdi-arrow-left">Voltar para Listagem</v-btn>
        </router-link>
      </v-card-text>
    </v-card>

    <!-- Image Dialog with Zoom and Rotation -->
    <v-dialog v-model="imageDialog" max-width="70vw">
      <v-card>
        <v-toolbar color="primary" dark>
          <v-toolbar-title>Visualizar Imagem</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon="mdi-rotate-right" @click="rotateImage"></v-btn>
          <v-btn icon="mdi-magnify-plus" @click="zoomIn"></v-btn>
          <v-btn icon="mdi-magnify-minus" @click="zoomOut"></v-btn>
          <v-btn icon="mdi-fit-to-screen" @click="resetZoom"></v-btn>
          <v-btn icon="mdi-close" @click="imageDialog = false"></v-btn>
        </v-toolbar>
        <v-card-text class="pa-0 image-dialog-content">
          <div class="image-container" @wheel.prevent="handleWheel">
            <v-img :src="arquivoUrl" :style="imageStyle" contain class="zoomable-image"></v-img>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- PDF Dialog with iframe -->
    <v-dialog v-model="pdfDialog" max-width="70vw">
      <v-card>
        <v-toolbar color="primary" dark>
          <v-toolbar-title>Visualizar PDF</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon="mdi-close" @click="pdfDialog = false"></v-btn>
        </v-toolbar>
        <v-card-text class="pa-0 pdf-dialog-content">
          <iframe :src="arquivoUrl" class="pdf-dialog-iframe" frameborder="0"></iframe>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import solicitacaoCertificadoService from '@/services/solicitacao-certificado/solicitacao-certificado-service'
import { onMounted, ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { toast } from 'vue3-toastify'
import dayjs from 'dayjs'
import 'vue3-toastify/dist/index.css'

const router = useRouter()
const route = useRoute()
const solicitacao = ref<any>(null)
const loading = ref(true)
const loadingValidar = ref(false)
const loadingInvalidar = ref(false)
const imageDialog = ref(false)
const pdfDialog = ref(false)
const imageZoom = ref(1)
const imageRotation = ref(0)

const arquivoUrl = computed(() => {
  if (!solicitacao.value?.arquivoUrl) return null
  return solicitacao.value.arquivoUrl
})

const isImage = computed(() => {
  if (!solicitacao.value?.contentTypeArquivo) return false
  const contentType = solicitacao.value.contentTypeArquivo.toLowerCase()
  return contentType.startsWith('image/')
})

const isPdf = computed(() => {
  if (!solicitacao.value?.contentTypeArquivo) return false
  const contentType = solicitacao.value.contentTypeArquivo.toLowerCase()
  return contentType === 'application/pdf' || contentType.includes('pdf')
})

const imageStyle = computed(() => {
  return {
    transform: `scale(${imageZoom.value}) rotate(${imageRotation.value}deg)`,
    transition: 'transform 0.3s ease',
    transformOrigin: 'center center'
  }
})

const openImageDialog = () => {
  imageDialog.value = true
  resetZoom()
}

const openPdfDialog = () => {
  pdfDialog.value = true
}

const zoomIn = () => {
  imageZoom.value = Math.min(imageZoom.value + 0.25, 5)
}

const zoomOut = () => {
  imageZoom.value = Math.max(imageZoom.value - 0.25, 0.5)
}

const resetZoom = () => {
  imageZoom.value = 1
  imageRotation.value = 0
}

const rotateImage = () => {
  imageRotation.value = (imageRotation.value + 90) % 360
}

const handleWheel = (event: WheelEvent) => {
  event.preventDefault()
  if (event.deltaY < 0) {
    zoomIn()
  } else {
    zoomOut()
  }
}

const formatCamposCertificado = (campos: string) => {
  if (!campos) return 'Nenhum campo enviado'
  try {
    const camposArray = JSON.parse(campos)
    if (Array.isArray(camposArray)) {
      return camposArray.join(', ')
    }
    return campos
  } catch (error) {
    return campos
  }
}

const getSituacaoColor = (situacao: string) => {
  if (!situacao) return 'grey'
  const situacaoUpper = situacao.toUpperCase()
  if (situacaoUpper === 'PENDENTE') return 'warning'
  if (situacaoUpper === 'VALIDO') return 'success'
  if (situacaoUpper === 'INVALIDO') return 'error'
  return 'grey'
}

const getSituacaoIcon = (situacao: string) => {
  if (!situacao) return 'mdi-help-circle'
  const situacaoUpper = situacao.toUpperCase()
  if (situacaoUpper === 'PENDENTE') return 'mdi-clock-outline'
  if (situacaoUpper === 'VALIDO') return 'mdi-check-circle'
  if (situacaoUpper === 'INVALIDO') return 'mdi-close-circle'
  return 'mdi-help-circle'
}

const formatDate = (date: string) => {
  if (!date) return 'N/A'
  return dayjs(date).format('DD/MM/YYYY HH:mm')
}

const loadSolicitacao = async () => {
  loading.value = true
  try {
    const id = route.query.id as string
    if (!id) {
      toast.error('ID da solicitação não encontrado')
      router.push('/solicitacaoCertificado')
      return
    }

    const response = await solicitacaoCertificadoService.getSolicitacaoCertificadoById(id)
    solicitacao.value = response.data || response
  } catch (error) {
    console.error('Erro ao carregar solicitação:', error)
    toast.error('Erro ao carregar dados da solicitação')
  } finally {
    loading.value = false
  }
}

const atualizarSituacao = async (situacao: 'Valido' | 'Invalido') => {
  if (!solicitacao.value?.id) return

  const isLoading = situacao === 'Valido' ? loadingValidar : loadingInvalidar
  isLoading.value = true

  try {
    await solicitacaoCertificadoService.putSolicitacaoCertificado(solicitacao.value.id, { situacao })

    const mensagem = situacao === 'Valido'
      ? 'Solicitação validada com sucesso!'
      : 'Solicitação invalidada com sucesso!'

    await loadSolicitacao()
    router.push('/solicitacaoCertificado').then(() => {
      toast.success(mensagem)
    })
  } catch (error) {
    console.error(`Erro ao ${situacao === 'Valido' ? 'validar' : 'invalidar'} solicitação:`, error)
    const mensagemErro = situacao === 'Valido'
      ? 'Erro ao validar solicitação'
      : 'Erro ao invalidar solicitação'
    toast.error(mensagemErro)
  } finally {
    isLoading.value = false
  }
}

const validarSolicitacao = () => atualizarSituacao('Valido')
const invalidarSolicitacao = () => atualizarSituacao('Invalido')

onMounted(async () => {
  await loadSolicitacao()
})
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

.main-card {
  border-radius: 16px;
  overflow: hidden;
}

.info-item {
  padding: 8px 0;
}

.file-viewer {
  position: relative;
  width: 100%;
  height: 600px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  overflow: hidden;
}

.file-iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.image-viewer-container {
  position: relative;
  width: 100%;
  height: 600px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  overflow: hidden;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.image-overlay {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 1;
}

.pdf-overlay {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 1;
}

.pdf-dialog-content {
  height: calc(100vh - 64px);
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
}

.pdf-dialog-iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.image-dialog-content {
  height: calc(100vh - 64px);
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
  cursor: grab;
}

.image-container:active {
  cursor: grabbing;
}

.zoomable-image {
  max-width: 100%;
  max-height: 100%;
  user-select: none;
}

@media (max-width: 960px) {
  .file-viewer {
    height: 400px;
  }
}

@media (max-width: 600px) {
  .header-content h1 {
    font-size: 1.75rem !important;
  }

  .file-viewer {
    height: 300px;
  }
}
</style>
