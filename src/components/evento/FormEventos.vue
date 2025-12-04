<template>
  <v-card class="form-card" elevation="4">
    <v-card-title class="pa-6 pb-4">
      <div class="d-flex align-center">
        <v-icon icon="mdi-calendar-plus" class="me-2" color="primary"></v-icon>
        <span class="text-h6 font-weight-medium">Criar Novo Evento</span>
      </div>
    </v-card-title>

    <v-divider></v-divider>

    <v-card-text class="pa-6">
      <v-form ref="formRef" @submit.prevent="submitForm">
        <!-- Basic Information Section -->
        <div class="mb-6">
          <v-sheet class="d-flex justify-space-between mb-6">
          <div class="">
          <h3 v-if="tab === 'one'" class="text-h6 font-weight-medium mb-4 text-primary">
            <v-icon icon="mdi-information" class="me-2" size="small"></v-icon>
            Informações Básicas
          </h3>

          <h3 v-if="tab === 'two'" class="text-h6 font-weight-medium mb-4 text-primary">
            <v-icon icon="mdi-information" class="me-2" size="small"></v-icon>
            Informações Básicas (EN)
          </h3>
          </div>

          <div class="">
            <v-tabs v-model="tab" class="">
              <v-tab value="one">
                PT
              </v-tab>
              <v-tab value="two">
                EN
              </v-tab>
            </v-tabs>
          </div>
          </v-sheet>



          <v-tabs-window v-model="tab">
            <v-tabs-window-item value="one">
              <v-row>
            <v-col class="mt-2" cols="12" md="6">
              <v-text-field
                v-model="form.titulo"
                label="Título do Evento"
                variant="outlined"
                prepend-inner-icon="mdi-calendar"
                :rules="[rules.required]"
                required
                density="comfortable"
                class="mb-3"
              ></v-text-field>
              <v-text-field
                v-model="form.data"
                label="Data do Evento"
                type="date"
                variant="outlined"
                prepend-inner-icon="mdi-calendar-clock"
                :rules="[rules.required]"
                required
                density="comfortable"
                class="mb-3"
              ></v-text-field>
              <v-combobox
                v-model="tipoEventoSelected"
                variant="outlined"
                label="Tipo do Evento"
                prepend-inner-icon="mdi-tag"
                :items="tipoEventos"
                item-title="nome"
                item-value="id"
                density="comfortable"
                class="mb-3"
              ></v-combobox>
            </v-col>
            <v-col class="mt-md-2" cols="12" md="6">
              <v-textarea
                v-model="form.descricao"
                label="Descrição do Evento"
                rows="3"
                variant="outlined"
                prepend-inner-icon="mdi-text-box-outline"
                :rules="[rules.required]"
                required
                density="comfortable"
                class="mb-3"
              ></v-textarea>
              <v-text-field
                v-model="form.local"
                label="Local do Evento"
                variant="outlined"
                prepend-inner-icon="mdi-map-marker"
                :rules="[rules.required]"
                required
                density="comfortable"
                class="mb-3"
              ></v-text-field>
              <v-combobox
                v-model="form.organizacoesEvento"
                variant="outlined"
                label="Organizações do Evento"
                prepend-inner-icon="mdi-domain"
                :items="OrganizacaoEventos"
                item-title="nome"
                item-value="id"
                multiple
                chips
                closable-chips
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
                v-model="form.en_titulo"
                label="Título do Evento"
                variant="outlined"
                prepend-inner-icon="mdi-calendar"
                :rules="[rules.required]"
                required
                density="comfortable"
              ></v-text-field>
                  <v-textarea
                v-model="form.en_descricao"
                label="Descrição do Evento"
                rows="3"
                variant="outlined"
                prepend-inner-icon="mdi-text-box-outline"
                :rules="[rules.required]"
                required
                density="comfortable"
              ></v-textarea>
                </v-col>

                <v-col class="mb-6 d-flex items-center flex-column mt-md-2" cols="12" md="4">
                  <v-btn prepend-icon="mdi-translate" color="primary" size="large" elevation="0" @click="traduzirCampos" :loading="loadingTranslation">
                    Traduzir
                  </v-btn>

                  <v-chip class="d-flex items-center justify-center mt-3" color="orange">
                    <v-icon class="mr-2" size="24">mdi-information</v-icon>
                    <span>
                    A tradução pode não ser 100% precisa.
                    </span>

                  </v-chip>
                </v-col>
              </v-row>
            </v-tabs-window-item>
          </v-tabs-window>
        </div>

        <!-- Distances Section -->
        <div class="mb-6">
          <h3 class="text-h6 font-weight-medium mb-4 text-primary">
            <v-icon icon="mdi-run" class="me-2" size="small"></v-icon>
            Distâncias do Evento
          </h3>
          <v-card class="pa-4 upload-card" elevation="1">
            <div class="d-flex ga-3 mb-3">
              <v-text-field
                v-model="novaDistancia"
                label="Distância (km)"
                type="number"
                variant="outlined"
                prepend-inner-icon="mdi-map-marker-distance"
                density="comfortable"
                @keyup.enter="adicionarDistancia"
                class="flex-grow-1"
              ></v-text-field>
              <v-btn
                @click="adicionarDistancia"
                color="primary"
                variant="outlined"
                prepend-icon="mdi-plus"
                size="large"
              >
                Adicionar
              </v-btn>
            </div>
            <div v-if="form.distanciasEvento.length > 0" class="mb-2">
              <v-chip
                v-for="(distancia, index) in form.distanciasEvento"
                :key="index"
                class="ma-1"
                closable
                color="primary"
                variant="tonal"
                @click:close="removerDistancia(index)"
              >
                {{ distancia }} km
              </v-chip>
            </div>
            <div v-else class="text-caption text-medium-emphasis">
              Nenhuma distância adicionada
            </div>
          </v-card>
        </div>


        <!-- Configuration Section -->
        <div class="mb-6">
          <h3 class="text-h6 font-weight-medium mb-4 text-primary">
            <v-icon icon="mdi-cog" class="me-2" size="small"></v-icon>
            Configurações do Evento
          </h3>
          <v-row>
            <v-col cols="12" md="4">
              <v-card class="pa-4 checkbox-card" :class="{ 'selected': form.ativo }" elevation="1">

                <v-switch
                  v-model="form.ativo"
                  label="Evento Ativo"
                  color="primary"
                  hide-details
                ></v-switch>
                <p class="text-caption text-medium-emphasis mt-2 mb-0">
                  Evento visível no sistema
                </p>
              </v-card>
            </v-col>
            <v-col cols="12" md="8">
              <v-card class="pa-4 checkbox-card" :class="{ 'selected': form.isCertificadoExclusivo }" elevation="1">

                <v-switch
                  v-model="form.isCertificadoExclusivo"
                  label="Certificado Exclusivo"
                  color="success"
                  hide-details
                ></v-switch>
                <p class="text-caption text-medium-emphasis mt-2 mb-0">
                  {{ form.isCertificadoExclusivo ? 'Possui certificado exclusivo' : 'Sem certificado exclusivo' }}
                </p>

                <v-alert
                  v-if="form.isCertificadoExclusivo"
                  type="info"
                  variant="tonal"
                  class="mt-3"
                  density="compact"
                >
                  <div class="text-caption">
                    Você pode selecionar os campos necessários para o certificado. Nosso sistema gerará automaticamente
                    ou você pode anexar um template personalizado para emissão pelos atletas.
                  </div>
                </v-alert>
                <v-alert
                  v-else
                  type="warning"
                  variant="tonal"
                  class="mt-3"
                  density="compact"
                >
                  <div class="text-caption">
                    Sem certificado exclusivo, os atletas utilizarão o template padrão da FitCertify365.
                    Você receberá os certificados com um dos templates que o sistema tem.
                  </div>
                </v-alert>
              </v-card>
            </v-col>
          </v-row>

              <v-expansion-panels v-if="form.isCertificadoExclusivo" class="mt-4">
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
                          <v-checkbox v-model="form.certificadoCampos" value="nomeAtleta" label="Nome do Atleta" hide-details></v-checkbox>
                          <v-checkbox v-model="form.certificadoCampos" value="nomeEvento" label="Nome do Evento" hide-details></v-checkbox>
                          <v-checkbox v-model="form.certificadoCampos" value="dataEvento" label="Data do Evento" hide-details></v-checkbox>
                          <v-checkbox v-model="form.certificadoCampos" value="localEvento" label="Local do Evento" hide-details></v-checkbox>
                        </v-col>
                        <v-col cols="6">
                          <v-checkbox v-model="form.certificadoCampos" value="distancia" label="Medico que certificou" hide-details></v-checkbox>
                          <v-checkbox v-model="form.certificadoCampos" value="tempo" label="Tempo de Conclusão" hide-details></v-checkbox>
                          <v-checkbox v-model="form.certificadoCampos" value="organizacao" label="Organização" hide-details></v-checkbox>
                          <v-checkbox v-model="form.certificadoCampos" value="cpfAtleta" label="Documento do Atleta" hide-details></v-checkbox>
                        </v-col>
                      </v-row>
                    </div>

                    <v-divider class="my-4"></v-divider>

                    <div>
                      <div class="text-subtitle-2 mb-3">Template Personalizado:</div>
                      <v-checkbox
                        v-model="form.usarTemplatePersonalizado"
                        label="Desejo anexar um template personalizado"
                        hide-details
                        class="mb-3"
                      ></v-checkbox>

                      <v-file-upload
                        v-if="form.usarTemplatePersonalizado"
                        v-model="form.templateCertificado"
                        label="Anexar Template (PDF, PNG, JPG)"
                        accept=".pdf,.png,.jpg,.jpeg"
                        variant="outlined"
                        clearable
                        show-size
                      ></v-file-upload>
                    </div>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
        </div>

        <!-- Images Section -->
        <div class="mb-6">
          <h3 class="text-h6 font-weight-medium mb-4 text-primary">
            <v-icon icon="mdi-image" class="me-2" size="small"></v-icon>
            Imagens do Evento
          </h3>
          <v-row>
            <v-col cols="12" md="6">
              <v-card class="pa-4 upload-card" elevation="1">
                <v-card-subtitle class="pa-0 mb-3 text-primary font-weight-medium">
                  <v-icon icon="mdi-image-outline" class="me-2" size="small"></v-icon>
                  Imagem do Evento
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
                  <v-icon icon="mdi-image-frame" class="me-2" size="small"></v-icon>
                  Logo do Evento
                </v-card-subtitle>
                <v-file-upload
                  v-model="form.logo"
                  label="Selecionar logo"
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

        <!-- Links do Evento -->
        <div class="mb-6">
          <h3 class="text-h6 font-weight-medium mb-4 text-primary">
            <v-icon icon="mdi-link-plus" class="me-2" size="small"></v-icon>
            Links do Evento
          </h3>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.linkEnviarCertificado"
                label="Link para enviar certificado"
                variant="outlined"
                prepend-inner-icon="mdi-link"
                density="comfortable"
                ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.linkSiteProva"
                label="Link para site da prova"
                variant="outlined"
                prepend-inner-icon="mdi-link"
                density="comfortable"
                class="mb-3"></v-text-field>
            </v-col>
          </v-row>
        </div>

        <!-- Actions -->
        <v-divider class="mb-6"></v-divider>
        <div class="d-flex justify-end ga-3">
          <v-btn
            variant="outlined"
            size="large"
            @click="router.push('/evento')"
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
            Criar Evento
          </v-btn>
        </div>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup >
import eventoService from '@/services/evento/evento-service'
import organizacaoEventos from '@/services/organizacao-evento/organizacao-evento-service'
import tipoEventoService from '@/services/tipo-evento/tipo-evento-service'
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import 'vue3-toastify/dist/index.css'


dayjs.extend(utc)

const tab = ref('one')
const router = useRouter()
const loading = ref(false)
const loadingTranslation = ref(false)
const formRef = ref(null)
const tipoEventos = ref([])
const OrganizacaoEventos = ref([])
const novaDistancia = ref('')
const tipoEventoSelected = ref('')
const OrganizacaoEventosSelected = ref('')
// const isCertificadoExclusivo = ref(false)

const form = ref({
  imagem: null,
  logo: null,
  titulo: '',
  en_titulo: '',
  descricao: '',
  en_descricao: '',
  data: '',
  local: '',
  ativo: true,
  tipoEventoId: '',
  distanciasEvento: [],
  organizacoesEvento: [],
  isCertificadoExclusivo: false,
  certificadoCampos: ['nomeAtleta', 'nomeEvento', 'dataEvento'],
  usarTemplatePersonalizado: false,
  templateCertificado: null,
  linkEnviarCertificado: '',
  linkSiteProva: '',
})

const rules = {
  required: (value) => !!value || 'Campo obrigatório',
}

const isFormValid = computed(() => {
  return form.value.titulo && form.value.descricao && form.value.en_titulo && form.value.en_descricao && form.value.local && form.value.imagem && form.value.logo && form.value.data && form.value.local
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

const traduzirTexto = async (sourceLanguage = 'pt', targetLanguage = 'en', content) => {
  if (!content || content.trim() === '') return ''

  try {
    const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY}`, {
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

const traduzirCampos = async () => {
  if (!form.value.titulo && !form.value.descricao) {
    toast.error('Preencha pelo menos o título ou descrição para traduzir')
    return
  }

  loadingTranslation.value = true
  try {
    if (form.value.titulo) {
      form.value.en_titulo = await traduzirTexto('pt', 'en', form.value.titulo)
    }
    if (form.value.descricao) {
      form.value.en_descricao = await traduzirTexto('pt', 'en', form.value.descricao)
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
    formData.append('en_titulo', form.value.en_titulo)
    formData.append('descricao', form.value.descricao)
    formData.append('en_descricao', form.value.en_descricao)
    formData.append('data', dayjs(form.value.data).utc().startOf('day').toISOString())
    formData.append('local', form.value.local)
    formData.append('tipoEventoId', tipoEventoSelected.value.id)
    formData.append('linkEnviarCertificado', form.value.linkEnviarCertificado)
    formData.append('linkSiteProva', form.value.linkSiteProva)

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
    await eventoService.createEvento(formData)

    router.push('/evento/').then(() => {
      toast.success('Evento criado com sucesso!')
    })
  } catch (error) {
    toast.error('Erro ao criar evento')
    console.error('Error creating evento:', error)
  } finally {
    loading.value = false
  }
}


onMounted(async () => {

  const response = await tipoEventoService.getAllTipoEventos()
  tipoEventos.value = response.data || []
  const responseOrganizacao = await organizacaoEventos.getAllOrganizacoes()
  OrganizacaoEventos.value = responseOrganizacao.data || []

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
