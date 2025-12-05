<template>
  <v-card class="form-card" elevation="4">
    <v-card-title class="pa-6 pb-4">
      <div class="d-flex align-center">
        <v-icon icon="mdi-domain-edit" class="me-2" color="primary"></v-icon>
        <span class="text-h6 font-weight-medium">Editar Organização</span>
      </div>
    </v-card-title>

    <v-divider></v-divider>

    <v-card-text class="pa-6">
      <v-form ref="formRef" @submit.prevent="submitForm">
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
                label="Nome da Organização"
                variant="outlined"
                prepend-inner-icon="mdi-domain"
                :rules="[rules.required]"
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
            Logo da Organização
          </h3>
          <v-row>
            <v-col cols="12" md="6">
              <v-card class="pa-4 upload-card" elevation="1">
                <v-card-subtitle class="pa-0 mb-3 text-primary font-weight-medium">
                  <v-icon icon="mdi-image-outline" class="me-2" size="small"></v-icon>
                  Logo da Organização
                </v-card-subtitle>
                
                <div v-if="imagePreview && !editingImage" class="text-center">
                  <v-img :src="imagePreview" max-height="200" class="mb-3 rounded"></v-img>
                  <v-btn @click="editingImage = true" color="primary" variant="outlined" size="small">
                    <v-icon icon="mdi-pencil" class="me-1"></v-icon>
                    Alterar Logo
                  </v-btn>
                </div>

                <v-file-upload
                  v-else
                  v-model="form.logo"
                  label="Selecionar nova logo"
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
            Atualizar Organização
          </v-btn>
        </div>
      </v-form>
    </v-card-text>
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
      router.push('/evento')
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

<style scoped>
.form-card {
  border-radius: 16px;
  overflow: hidden;
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
