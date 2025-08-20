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
            item-title="nome" item-value="id"></v-combobox>

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
const novaDistancia = ref('')
const tipoEventoSelected = ref('')

const form = ref({
  imagem: null,
  logo: null,
  titulo: '',
  descricao: '',
  data: '',
  local: '',
  ativo: true,
  tipoEventoId: '',
  distanciasEvento: []
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
    formData.append('distanciasEvento', form.value.distanciasEvento)
    formData.append('ativo', form.value.ativo)


    if (form.value.logo) {
      formData.append('logo', form.value.logo)
    }
    if (form.value.imagem) {
      formData.append('imagem', form.value.imagem)
    }
    console.log(formData)
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
  console.log(tipoEventos.value)

})
</script>
