<template>
  <v-card class="pa-6">
    <v-card-title class="text-h5 mb-4">{{ props.id ? 'Editar Evento' : 'Criar Novo Evento' }}</v-card-title>

    <v-form ref="formRef" @submit.prevent="submitForm">
      <v-row>
        <v-col cols="6">
          <v-text-field v-model="form.titulo" label="Titulo" :rules="[rules.required]" variant="outlined"
            class="mb-3"></v-text-field>

          <v-textarea v-model="form.descricao" label="Descricao" :rules="[rules.required]" variant="outlined"
            class="mb-3"></v-textarea>

          <v-text-field v-model="form.data" label="Data" type="date" :rules="[rules.required]" variant="outlined"
            class="mb-3"></v-text-field>

          <v-text-field v-model="form.local" label="Local" :rules="[rules.required]" variant="outlined"
            class="mb-3"></v-text-field>

          <v-combobox v-model="tipoEventoSelected" variant="outlined" label="Tipo do Evento" :items="tipoEventos"
            item-title="nome" item-value="id" class="mb-3"></v-combobox>

          <v-combobox v-model="form.organizacoesEvento" variant="outlined" label="Organizações do Evento"
            :items="OrganizacaoEventos" item-title="nome" item-value="id" multiple chips closable-chips
            class="mb-3"></v-combobox>

          <v-card variant="outlined" class="pa-4 mb-3">
            <v-card-subtitle class="pa-0 mb-3">Distâncias do Evento</v-card-subtitle>
            <div class="d-flex gap-6 mb-3">
              <v-text-field v-model="novaDistancia" label="Distância (km)" type="number" variant="outlined"
                density="compact" @keyup.enter="adicionarDistancia"></v-text-field>
              <v-btn @click="adicionarDistancia" color="primary" variant="outlined">
                Add
              </v-btn>
            </div>
            <div v-if="form.distanciasEvento.length > 0">
              <v-chip v-for="(distancia, index) in form.distanciasEvento" :key="index" class="ma-1" closable
                @click:close="removerDistancia(index)">
                {{ distancia }} km
              </v-chip>
            </div>
            <div v-else class="text-caption text-medium-emphasis">
              Nenhuma distância adicionada
            </div>
          </v-card>

          <v-card variant="outlined" class="pa-4 mb-3">
            <v-card-subtitle class="pa-0 mb-4">Configurações do Evento</v-card-subtitle>

            <div class="mb-4">
              <div class="text-subtitle-2 mb-2">Status do Evento</div>
              <v-switch color="primary" v-model="form.ativo" :label="form.ativo ? 'Evento Ativo' : 'Evento Inativo'"
                hide-details></v-switch>
            </div>

            <v-divider class="my-4"></v-divider>

            <div>
              <div class="text-subtitle-2 mb-2">Certificado Exclusivo</div>

              <!-- Aviso de pendente (substitui todas as informações quando pendente) -->
              <v-alert v-if="isTemplatePendente" type="warning" variant="tonal"
                class="mt-3" density="compact">
                <div class="text-caption">
                  O template do certificado está pendente de avaliação. Aguarde a aprovação para poder alterá-lo.
                </div>
              </v-alert>

              <!-- Informações normais (só aparecem se não estiver pendente) -->
              <template v-if="!isTemplatePendente">
                <v-switch color="primary" v-model="form.isCertificadoExclusivo"
                  :label="form.isCertificadoExclusivo ? 'Possui certificado exclusivo' : 'Sem certificado exclusivo'"
                  hide-details></v-switch>

                <v-alert v-if="form.isCertificadoExclusivo" type="info" variant="tonal" class="mt-3" density="compact">
                  <div class="text-caption">
                    Você pode selecionar os campos necessários para o certificado. Nosso sistema gerará automaticamente
                    ou você pode anexar um template personalizado para emissão pelos atletas.
                  </div>
                </v-alert>
                <v-alert v-else type="warning" variant="tonal" class="mt-3" density="compact">
                  <div class="text-caption">
                    Sem certificado exclusivo, os atletas utilizarão o template padrão da FitCertify365.
                    Você receberá os certificados com um dos templates que o sistema tem.
                  </div>
                </v-alert>
              </template>

              <!-- Expansion panel para configurar certificado (aparece se puder alterar ou se não houver solicitação) -->
              <v-expansion-panels v-if="form.isCertificadoExclusivo && (podeAlterarTemplate || !temSolicitacaoCertificado)" class="mt-4">
                <v-expansion-panel>
                  <v-expansion-panel-title>
                    <v-icon icon="mdi-certificate" class="me-2"></v-icon>
                    Configurar Certificado
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <div class="mb-4">
                      <v-alert type="info" variant="tonal" density="compact" class="mb-4">
                        <div class="text-caption">
                          A logo será automaticamente incluída do arquivo enviado acima.
                          Selecione os campos que deseja incluir no certificado.
                        </div>
                      </v-alert>

                      <div class="text-subtitle-2 mb-3">Campos do Certificado:</div>
                      <v-row>
                        <v-col cols="6">
                          <v-checkbox v-model="form.certificadoCampos" value="nomeAtleta" label="Nome do Atleta"
                            hide-details></v-checkbox>
                          <v-checkbox v-model="form.certificadoCampos" value="nomeEvento" label="Nome do Evento"
                            hide-details></v-checkbox>
                          <v-checkbox v-model="form.certificadoCampos" value="dataEvento" label="Data do Evento"
                            hide-details></v-checkbox>
                          <v-checkbox v-model="form.certificadoCampos" value="localEvento" label="Local do Evento"
                            hide-details></v-checkbox>
                        </v-col>
                        <v-col cols="6">
                          <v-checkbox v-model="form.certificadoCampos" value="distancia" label="Medico que certificou"
                            hide-details></v-checkbox>
                          <v-checkbox v-model="form.certificadoCampos" value="tempo" label="Tempo de Conclusão"
                            hide-details></v-checkbox>
                          <v-checkbox v-model="form.certificadoCampos" value="organizacao" label="Organização"
                            hide-details></v-checkbox>
                          <v-checkbox v-model="form.certificadoCampos" value="cpfAtleta" label="Documento do Atleta"
                            hide-details></v-checkbox>
                        </v-col>
                      </v-row>
                    </div>

                    <v-divider class="my-4"></v-divider>

                    <div>
                      <div class="text-subtitle-2 mb-3">Template Personalizado:</div>

                      <v-checkbox v-model="form.usarTemplatePersonalizado"
                        label="Desejo anexar um template personalizado" hide-details class="mb-3"></v-checkbox>

                      <div v-if="templatePreview && !form.templateCertificado && !form.usarTemplatePersonalizado"
                        class="text-center mb-3">
                        <!-- PDF Preview -->
                        <div v-if="isTemplatePdf" class="template-preview-pdf mb-3">
                          <iframe :src="templatePreview" class="template-iframe" frameborder="0"></iframe>
                        </div>
                        <!-- Image Preview -->
                        <v-img v-else-if="isTemplateImage" :src="templatePreview" max-height="200" class="mb-3"></v-img>
                        <v-btn @click="form.usarTemplatePersonalizado = true" color="primary" variant="outlined"
                          size="small">
                          Alterar Template
                        </v-btn>
                      </div>

                      <v-file-upload v-if="form.usarTemplatePersonalizado" v-model="form.templateCertificado"
                        label="Anexar Template (PDF, PNG, JPG)" accept=".pdf,.png,.jpg,.jpeg" variant="outlined"
                        clearable show-size></v-file-upload>
                    </div>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </div>
          </v-card>
        </v-col>

        <v-col>
          <v-card variant="outlined" class="pa-4 mb-3">
            <v-card-subtitle class="pa-0 mb-3">Imagem do Evento</v-card-subtitle>

            <div v-if="imagePreview.imagem && !editingImage.imagem" class="text-center">
              <v-img :src="imagePreview.imagem" max-height="200" class="mb-3"></v-img>
              <v-btn @click="editingImage.imagem = true" color="primary" variant="outlined" size="small">
                Alterar Imagem
              </v-btn>
            </div>

            <v-file-upload v-else v-model="form.imagem" label="Selecionar imagem" clearable show-size accept="image/*"
              variant="outlined"></v-file-upload>
          </v-card>

          <v-card variant="outlined" class="pa-4">
            <v-card-subtitle class="pa-0 mb-3">Logo do Evento</v-card-subtitle>

            <div v-if="imagePreview.logo && !editingImage.logo" class="text-center">
              <v-img :src="imagePreview.logo" max-height="200" class="mb-3"></v-img>
              <v-btn @click="editingImage.logo = true" color="primary" variant="outlined" size="small">
                Alterar Logo
              </v-btn>
            </div>

            <v-file-upload v-else v-model="form.logo" label="Selecionar Logo" clearable show-size accept="image/*"
              variant="outlined"></v-file-upload>
          </v-card>
        </v-col>
      </v-row>

      <v-divider class="my-6"></v-divider>

      <v-row>
        <v-col class="d-flex justify-space-between">
          <v-btn variant="outlined" @click="router.push('/evento/')" size="large">
            Cancelar
          </v-btn>

          <v-btn :disabled="!isFormValid" @click="submitForm" color="primary" :loading="loading" size="large">
            {{ props.id ? 'Atualizar Evento' : 'Criar Evento' }}
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-card>
</template>

<script setup>
import eventoService from '@/services/evento/evento-service'
import organizacaoEventos from '@/services/organizacao-evento/organizacao-evento-service'
import tipoEventoService from '@/services/tipo-evento/tipo-evento-service'
import { computed, ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import 'vue3-toastify/dist/index.css'

dayjs.extend(utc)

const props = defineProps({
  id: String
})

const router = useRouter()
const loading = ref(false)
const formRef = ref(null)
const tipoEventos = ref([])
const OrganizacaoEventos = ref([])
const novaDistancia = ref('')
const tipoEventoSelected = ref('')
const ultimaSolicitacaoCertificado = ref(null)
const imagePreview = ref({
  imagem: null,
  logo: null
})

const editingImage = ref({
  imagem: false,
  logo: false
})

const templatePreview = ref(null)
const templateContentType = ref(null)
const situacaoCertificado = ref(null)
const temSolicitacaoCertificado = ref(false)

const isTemplatePdf = computed(() => {
  if (!templateContentType.value) return false
  const contentType = templateContentType.value.toLowerCase()
  return contentType === 'application/pdf' || contentType.includes('pdf')
})

const isTemplateImage = computed(() => {
  if (!templateContentType.value) return false
  const contentType = templateContentType.value.toLowerCase()
  return contentType.startsWith('image/')
})

const podeAlterarTemplate = computed(() => {
  if (!situacaoCertificado.value) return false
  const situacao = situacaoCertificado.value.toUpperCase()
  return situacao === 'VALIDO' || situacao === 'INVALIDO'
})

const isTemplatePendente = computed(() => {
  if (!situacaoCertificado.value) return false
  const situacao = situacaoCertificado.value.toUpperCase()
  return situacao === 'PENDENTE'
})

const form = ref({
  imagem: null,
  logo: null,
  titulo: '',
  descricao: '',
  data: '',
  local: '',
  ativo: true,
  tipoEventoId: '',
  distanciasEvento: [],
  organizacoesEvento: [],
  isCertificadoExclusivo: false,
  certificadoCampos: [],
  usarTemplatePersonalizado: false,
  templateCertificado: null
})

const rules = {
  required: (value) => !!value || 'Campo obrigatório',
}

const isFormValid = computed(() => {
  const hasImages = props.id ?
    (imagePreview.value.imagem || form.value.imagem) && (imagePreview.value.logo || form.value.logo) :
    form.value.imagem && form.value.logo

  return form.value.titulo && form.value.descricao && form.value.local && form.value.data && hasImages
})

const adicionarDistancia = () => {
  if (novaDistancia.value && !form.value.distanciasEvento.includes(novaDistancia.value)) {
    form.value.distanciasEvento.push(novaDistancia.value)
    novaDistancia.value = ''
  }
}

const removerDistancia = (index) => {
  form.value.distanciasEvento.splice(index, 1)
}

const submitForm = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  loading.value = true
  try {
    const formData = new FormData()
    formData.append('titulo', form.value.titulo)
    formData.append('descricao', form.value.descricao)
    formData.append('data', dayjs(form.value.data).format('YYYY-MM-DD'))
    formData.append('local', form.value.local)
    formData.append('tipoEventoId', tipoEventoSelected.value.id)

    // Adicionar distâncias como array
    formData.append('distanciasEvento', form.value.distanciasEvento)

    // Adicionar organizações como array de IDs
    form.value.organizacoesEvento.forEach(org => {
      formData.append('organizacoesEvento', org.id)
    })

    formData.append('ativo', form.value.ativo)

    if (form.value.logo) {
      formData.append('logo', form.value.logo)
    }
    if (form.value.imagem) {
      formData.append('imagem', form.value.imagem)
    }

    if (form.value.isCertificadoExclusivo) {
      formData.append('possuiCertificadoExclusivo', form.value.isCertificadoExclusivo)
      
      // Enviar campos do certificado como array JSON
      formData.append('solicitacaoCertificado.camposCertificado', JSON.stringify(form.value.certificadoCampos))

      // Enviar arquivo do template se existir
      if (form.value.templateCertificado) {
        formData.append('solicitacaoCertificado.arquivo', form.value.templateCertificado)
      }
      formData.append('solicitacaoCertificado.situacao', 'Pendente')
    }

    if (props.id) {
      await eventoService.updateEvento(props.id, formData)
      router.push('/evento/').then(() => {
        toast.success('Evento atualizado com sucesso!')
      })
    } else {
      await eventoService.createEvento(formData)
      router.push('/evento/').then(() => {
        toast.success('Evento criado com sucesso!')
      })
    }

  } catch (error) {
    toast.error(props.id ? 'Erro ao atualizar evento' : 'Erro ao criar evento')
    console.error('Error submitting evento:', error)
  } finally {
    loading.value = false
  }
}

const loadEvento = async () => {
  if (!props.id) {
    temSolicitacaoCertificado.value = false
    return
  }

  try {
    const response = await eventoService.getEventoById(props.id)
    const evento = response.data

    // Carregar campos do certificado se existir (pegar sempre o último)
    let certificadoCampos = ['nomeAtleta', 'nomeEvento', 'dataEvento']
    const solicitacoesCertificado = evento.solicitacoesCertificado || []
    const ultimaSolicitacao = solicitacoesCertificado.length > 0
      ? solicitacoesCertificado[solicitacoesCertificado.length - 1]
      : null
    // Atualizar se existe solicitação de certificado
    temSolicitacaoCertificado.value = ultimaSolicitacao !== null
    ultimaSolicitacaoCertificado.value = ultimaSolicitacao
    // Resetar situação e preview do template
    situacaoCertificado.value = null
    templatePreview.value = null
    templateContentType.value = null

    if (ultimaSolicitacao?.camposCertificado) {
      try {
        certificadoCampos = typeof ultimaSolicitacao.camposCertificado === 'string'
          ? JSON.parse(ultimaSolicitacao.camposCertificado)
          : ultimaSolicitacao.camposCertificado
      } catch (e) {
        console.error('Erro ao parsear campos do certificado:', e)
      }
    }

    form.value = {
      titulo: evento.titulo || '',
      descricao: evento.descricao || '',
      data: dayjs(evento.data).utc().format('YYYY-MM-DD'),
      local: evento.local || '',
      imagem: null,
      logo: null,
      ativo: evento.ativo,
      tipoEventoId: evento.tipoEventoId || '',
      distanciasEvento: evento.distanciasEvento?.map(d => d.distancia) || [],
      organizacoesEvento: evento.organizacaoEvento?.map(org => org.organizacao) || [],
      isCertificadoExclusivo: evento.possuiCertificadoExclusivo || false,
      certificadoCampos: certificadoCampos,
      usarTemplatePersonalizado: false,
      templateCertificado: null
    }

    // Buscar tipo de evento pelos dados carregados
    tipoEventoSelected.value = tipoEventos.value.find(tipo => tipo.id === evento.tipoEventoId) || ''

    // Definir previews das imagens
    imagePreview.value.imagem = evento.imagemUrl || null
    imagePreview.value.logo = evento.logoUrl || null

    // Definir preview do template e situação se existir (pegar sempre o último)
    if (ultimaSolicitacao?.arquivoUrl) {
      templatePreview.value = ultimaSolicitacao.arquivoUrl
      templateContentType.value = ultimaSolicitacao.contentTypeArquivo || null
    }
    
    // Carregar situação do último certificado
    if (ultimaSolicitacao?.situacao) {
      situacaoCertificado.value = ultimaSolicitacao.situacao
    }
  } catch (error) {
    toast.error('Erro ao carregar evento')
    console.error('Error loading evento:', error)
  }
}

watch(() => props.id, (newId) => {
  if (newId) {
    loadEvento()
  }
})

onMounted(async () => {
  try {
    const response = await tipoEventoService.getAllTipoEventos()
    tipoEventos.value = response.data || []

    const responseOrganizacao = await organizacaoEventos.getAllOrganizacoes()
    OrganizacaoEventos.value = responseOrganizacao.data || []
  } catch (error) {
    console.error('Erro ao carregar dados:', error)
  }

  if (props.id) {
    await loadEvento()
  }
})
</script>

<style scoped>
.template-preview-pdf {
  width: 100%;
  height: 300px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  overflow: hidden;
}

.template-iframe {
  width: 100%;
  height: 100%;
  border: none;
}
</style>
