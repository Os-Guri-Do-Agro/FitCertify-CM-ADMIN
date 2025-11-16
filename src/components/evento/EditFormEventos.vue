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

          <v-col>

            <v-card variant="outlined" class="pa-2">
              <v-card-subtitle class="pa-0 mb-3">Configurações</v-card-subtitle>
              <v-row>
                <v-col cols="2">
                  <v-switch color="primary" v-model="form.ativo" label="Ativo"></v-switch>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
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

<script setup >
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

const imagePreview = ref({
  imagem: null,
  logo: null
})

const editingImage = ref({
  imagem: false,
  logo: false
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
  organizacoesEvento: []
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

    if (props.id) {
      await eventoService.updateEvento(props.id, formData)
      toast.success('Evento atualizado com sucesso!')
    } else {
      await eventoService.createEvento(formData)
      toast.success('Evento criado com sucesso!')
    }

    setTimeout(() => {
      router.push('/evento/')
    }, 2500)
  } catch (error) {
    toast.error(props.id ? 'Erro ao atualizar evento' : 'Erro ao criar evento')
    console.error('Error submitting evento:', error)
  } finally {
    loading.value = false
  }
}

const loadEvento = async () => {
  if (!props.id) return

  try {
    const response = await eventoService.getEventoById(props.id)
    const evento = response.data

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
      organizacoesEvento: evento.organizacaoEvento?.map(org => org.organizacao) || []
    }

    // Buscar tipo de evento pelos dados carregados
    tipoEventoSelected.value = tipoEventos.value.find(tipo => tipo.id === evento.tipoEventoId) || ''

    // Definir previews das imagens
    imagePreview.value.imagem = evento.imagemUrl || null
    imagePreview.value.logo = evento.logoUrl || null
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
