<template>
  <v-card class="form-card" elevation="4">

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
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.cnpj"
                label="CNPJ"
                variant="outlined"
                prepend-inner-icon="mdi-card-account-details"
                :rules="[rules.required, rules.cnpj]"
                required
                density="comfortable"
                @input="maskCNPJ"
                maxlength="18"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.cep"
                label="CEP/ZIP Code"
                variant="outlined"
                prepend-inner-icon="mdi-map-marker"
                required
                density="comfortable"
                @input="maskCEP"
                maxlength="10"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.telefone"
                label="Telefone"
                variant="outlined"
                prepend-inner-icon="mdi-phone"
                required
                density="comfortable"
                @input="maskTelefone"
                maxlength="15"
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
            Criar Organização
          </v-btn>
        </div>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
import organizacaoService from '@/services/organizacao-evento/organizacao-evento-service'
import { isSuperAdmin } from '@/utils/auth'
import { computed, ref, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const emit = defineEmits(['organizacao-saved'])

const router = useRouter()
const loading = ref(false)
const formRef = ref(null)
const organizacao = ref(null)

const form = ref({
  nome: '',
  cnpj: '',
  cep: '',
  telefone: '',
  sobre: '',
  logo: null,
  ativo: true,
})

const rules = {
  required: (value) => !!value || 'Campo obrigatório',
  cnpj: (value) => {
    const cnpj = value?.replace(/\D/g, '')
    return cnpj?.length === 14 || 'CNPJ deve ter 14 dígitos'
  },
}

const maskCNPJ = (event) => {
  let value = event.target.value.replace(/\D/g, '')
  value = value.replace(/(\d{2})(\d)/, '$1.$2')
  value = value.replace(/(\d{3})(\d)/, '$1.$2')
  value = value.replace(/(\d{3})(\d)/, '$1/$2')
  value = value.replace(/(\d{4})(\d)/, '$1-$2')
  form.value.cnpj = value
}

const maskTelefone = (event) => {
  let value = event.target.value.replace(/\D/g, '')
  if (value.length <= 10) {
    value = value.replace(/(\d{2})(\d)/, '($1) $2')
    value = value.replace(/(\d{4})(\d)/, '$1-$2')
  } else {
    value = value.replace(/(\d{2})(\d)/, '($1) $2')
    value = value.replace(/(\d{5})(\d)/, '$1-$2')
  }
  form.value.telefone = value
}

const maskCEP = (event) => {
  let value = event.target.value.replace(/\D/g, '')
  if (value.length <= 5) {
    // US ZIP format: 12345
    form.value.cep = value
  } else if (value.length <= 8) {
    // Brazilian CEP format: 12345-678
    value = value.replace(/(\d{5})(\d)/, '$1-$2')
    form.value.cep = value
  } else {
    // US ZIP+4 format: 12345-6789
    value = value.replace(/(\d{5})(\d)/, '$1-$2')
    form.value.cep = value
  }
}

const isFormValid = computed(() => {
  return form.value.nome && form.value.cnpj
})

const validarExisteOrganizacao = async () => {
  try {
    const response = await organizacaoService.getAllOrganizacoes()
    organizacao.value = response.data
  } catch (error) {
    console.error('Error fetching organizacao:', error)
  }
}

onMounted(() => {
  validarExisteOrganizacao()
})

const submitForm = async () => {

  if (!isSuperAdmin() && organizacao.value && organizacao.value.length > 0) {
    toast.error('Já existe uma organização cadastrada!')
    return
  }

  const { valid } = await formRef.value.validate()
  if (!valid) return

  loading.value = true
  try {
    const formData = new FormData()
    formData.append('nome', form.value.nome)
    formData.append('cnpj', form.value.cnpj)
    formData.append('cep', form.value.cep)
    formData.append('telefone', form.value.telefone)
    if (form.value.logo) {
      formData.append('logo', form.value.logo)
    }


    await organizacaoService.createOrganizacao(formData)

    await validarExisteOrganizacao()
    emit('organizacao-saved')
    toast.success('Organizacao criada com sucesso!')

    // Reset form and validations
    form.value = {
      nome: '',
      cnpj: '',
      cep: '',
      telefone: '',
      sobre: '',
      logo: null,
      ativo: true,
    }
    await nextTick()
    formRef.value?.resetValidation()
  } catch (error) {
    toast.error('Erro ao criar organizacao')
    console.error('Error creating organizacao:', error)
  } finally {
    loading.value = false
  }
}
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
