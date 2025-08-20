<template>
  <v-card class="pa-6">
    <v-card-title class="text-h5 mb-4">Editar Organização</v-card-title>
    <v-form ref="formRef" @submit.prevent="submitForm">
      <v-row>
        <v-col cols="6">
          <v-text-field
            v-model="form.nome"
            label="Nome"
            :rules="[rules.required]"
            variant="outlined"
            class="mb-3"
          ></v-text-field>
        </v-col>

        <v-col>
          <v-card variant="outlined" class="pa-4">
            <v-card-subtitle class="pa-0 mb-3"
              >Logo da Organização</v-card-subtitle
            >

            <div v-if="imagePreview && !editingImage" class="text-center">
              <v-img :src="imagePreview" max-height="200" class="mb-3"></v-img>
              <v-btn
                @click="editingImage = true"
                color="primary"
                variant="outlined"
                size="small"
              >
                Alterar Logo
              </v-btn>
            </div>

            <v-file-upload
              v-else
              v-model="form.logo"
              label="Selecionar imagem"
              clearable
              show-size
              accept="image/*"
              variant="outlined"
            ></v-file-upload>
          </v-card>
        </v-col>
      </v-row>

      <v-divider class="my-6"></v-divider>

      <v-row>
        <v-col class="d-flex justify-space-between">
          <v-btn
            variant="outlined"
            @click="router.push('/organizacao/')"
            size="large"
          >
            Cancelar
          </v-btn>

          <v-btn
            :disabled="!isFormValid"
            @click="submitForm"
            color="primary"
            :loading="loading"
            size="large"
          >
            Atualizar Organização
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-card>
</template>

<script setup>
import organizacaoService from '@/services/organizacao-evento/organizacao-evento-service'
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const props = defineProps({
  id: String,
})

const router = useRouter()
const loading = ref(false)
const formRef = ref(null)

const imagePreview = ref(null)
const editingImage = ref(false)

const form = ref({
  nome: '',
  logo: null,
  ativo: true,
})

const rules = {
  required: (value) => !!value || 'Campo obrigatório',
}

const isFormValid = computed(() => {
  return form.value.nome
})

const submitForm = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  loading.value = true
  try {
    const formData = new FormData()
    formData.append('nome', form.value.nome)

    if (form.value.logo) {
      formData.append('logo', form.value.logo)
    }

    await organizacaoService.updateOrganizacao(props.id, formData)

    toast.success('Organização atualizada com sucesso!')
    setTimeout(() => {
      router.push('/organizacao')
    }, 2500)
  } catch (error) {
    toast.error('Erro ao atualizar organização')
    console.error('Error updating organizacao:', error)
  } finally {
    loading.value = false
  }
}

const loadOrganizacao = async () => {
  if (!props.id) return

  try {
    const response = await organizacaoService.getOrganizacaoById(props.id)
    const organizacao = response.data

    form.value = {
      nome: organizacao.nome || '',
      logo: null,
      ativo: organizacao.ativo,
    }

    imagePreview.value = organizacao.logoUrl || null
  } catch (error) {
    toast.error('Erro ao carregar organização')
  }
}

watch(
  () => props.id,
  (newId) => {
    if (newId) {
      loadOrganizacao()
    }
  }
)

onMounted(async () => {
  await loadOrganizacao()
})
</script>
