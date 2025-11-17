<template>
  <v-card class="pa-6">
    <v-card-title class="text-h5 mb-4">Criar Novo Evento</v-card-title>

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
              <v-switch
                color="primary"
                v-model="form.ativo"
                :label="form.ativo ? 'Evento Ativo' : 'Evento Inativo'"
                hide-details
              ></v-switch>
            </div>

            <v-divider class="my-4"></v-divider>

            <div>
              <div class="text-subtitle-2 mb-2">Certificado Exclusivo</div>
              <v-switch
                color="primary"
                v-model="form.isCertificadoExclusivo"
                :label="form.isCertificadoExclusivo ? 'Possui certificado exclusivo' : 'Sem certificado exclusivo'"
                hide-details
              ></v-switch>

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
          </v-card>
        </v-col>

        <v-col cols="6">
          <v-card variant="outlined" class="pa-4">
            <v-card-subtitle class="pa-0 mb-3">Imagem do Evento</v-card-subtitle>
            <v-file-upload v-model="form.imagem" label="Selecionar imagem" clearable show-size accept="image/*"
              variant="outlined"></v-file-upload>
          </v-card>
          <!-- #Todo -->
          <v-card variant="outlined" class="pa-4">
            <v-card-subtitle class="pa-0 mb-3">Logo do Evento</v-card-subtitle>
            <v-file-upload v-model="form.logo" label="Selecionar Logo" clearable show-size accept="image/*"
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
            Criar Evento
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
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

const router = useRouter()
const loading = ref(false)
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
  descricao: '',
  data: '',
  local: '',
  ativo: true,
  tipoEventoId: '',
  distanciasEvento: [],
  organizacoesEvento: [],
  isCertificadoExclusivo: false,
  certificadoCampos: ['nomeAtleta', 'nomeEvento', 'dataEvento'],
  usarTemplatePersonalizado: false,
  templateCertificado: null
})

const rules = {
  required: (value) => !!value || 'Campo obrigatório',
}

const isFormValid = computed(() => {
  return form.value.titulo && form.value.descricao && form.value.local && form.value.imagem && form.value.logo && form.value.data && form.value.local
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
    formData.append('data', dayjs(form.value.data).utc().startOf('day').toISOString())
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
    await eventoService.createEvento(formData)

    toast.success('Evento criado com sucesso!')
    setTimeout(() => {
      router.push('/evento/')
    }, 2500)
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
