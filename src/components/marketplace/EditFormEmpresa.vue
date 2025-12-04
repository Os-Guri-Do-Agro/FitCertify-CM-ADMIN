<template>
  <v-card class="form-card" elevation="4">
    <v-card-title class="pa-6 pb-4">
      <div class="d-flex align-center">
        <v-icon icon="mdi-domain-edit" class="me-2" color="primary"></v-icon>
        <span class="text-h6 font-weight-medium">Editar Empresa</span>
      </div>
    </v-card-title>

    <v-divider></v-divider>

    <v-card-text class="pa-6">
      <v-form ref="formRef" @submit.prevent="submitForm">
        <!-- Basic Information Section -->
        <div class="mb-6">
          <v-sheet class="d-flex justify-space-between mb-6">
            <div>
              <h3 v-if="tab === 'one'" class="text-h6 font-weight-medium mb-4 text-primary">
                <v-icon icon="mdi-information" class="me-2" size="small"></v-icon>
                Informações Básicas
              </h3>
              <h3 v-if="tab === 'two'" class="text-h6 font-weight-medium mb-4 text-primary">
                <v-icon icon="mdi-information" class="me-2" size="small"></v-icon>
                Informações Básicas (EN)
              </h3>
            </div>
            <div>
              <v-tabs v-model="tab">
                <v-tab value="one"><v-img src="/br-flag.png" :width="20" cover class="mr-2"></v-img> PT</v-tab>
                <v-tab value="two"><v-img src="/en-flag.png" :width="20" cover class="mr-2"></v-img> EN</v-tab>
              </v-tabs>
            </div>
          </v-sheet>

          <v-tabs-window v-model="tab">
            <v-tabs-window-item value="one">
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.nome"
                    label="Nome da Empresa"
                    variant="outlined"
                    prepend-inner-icon="mdi-domain"
                    :rules="[rules.required]"
                    required
                    density="comfortable"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-textarea
                    v-model="form.sobre"
                    label="Sobre a Empresa"
                    rows="3"
                    variant="outlined"
                    prepend-inner-icon="mdi-text-box-outline"
                    :rules="[rules.required]"
                    required
                    density="comfortable"
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-tabs-window-item>

            <v-tabs-window-item value="two">
              <v-row>
                <v-col cols="12" md="6">
                  <v-textarea
                    v-model="form.en_descricao"
                    label="Sobre a Empresa"
                    rows="3"
                    variant="outlined"
                    prepend-inner-icon="mdi-text-box-outline"
                    :rules="[rules.required]"
                    required
                    density="comfortable"
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-tabs-window-item>
          </v-tabs-window>
        </div>

        <!-- Logo Section -->
        <div class="mb-6">
          <h3 class="text-h6 font-weight-medium mb-4 text-primary">
            <v-icon icon="mdi-image" class="me-2" size="small"></v-icon>
            Logo da Empresa
          </h3>
          <v-row>
            <v-col cols="12" md="6">
              <v-card class="pa-4 upload-card" elevation="1">
                <v-card-subtitle class="pa-0 mb-3 text-primary font-weight-medium">
                  <v-icon icon="mdi-image-outline" class="me-2" size="small"></v-icon>
                  Logo da Empresa
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

        <!-- Configuration Section -->
        <div class="mb-6">
          <h3 class="text-h6 font-weight-medium mb-4 text-primary">
            <v-icon icon="mdi-cog" class="me-2" size="small"></v-icon>
            Configurações
          </h3>
          <v-row>
            <v-col cols="12" md="4">
              <v-card class="pa-4 checkbox-card" :class="{ 'selected': form.ativo }" elevation="1">
                <v-switch
                  v-model="form.ativo"
                  label="Ativo"
                  color="primary"
                  hide-details
                ></v-switch>
                <p class="text-caption text-medium-emphasis mt-2 mb-0">
                  Empresa visível no sistema
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
            @click="router.push('/marketplace')"
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
            Atualizar Empresa
          </v-btn>
        </div>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css';
import empresaService from '@/services/empresa/empresa-service';
const props = defineProps({
  id: String

})

const router = useRouter()
const loading = ref(false)
const formRef = ref(null)

const imagePreview = ref(null)
const editingImage = ref(false)

const tab = ref('one')

const form = ref({
  nome: '',
  sobre: '',
  en_descricao: '',
  logo: null,
  ativo: true,
})

const rules = {
  required: (value) => !!value || 'Campo obrigatório'
}

const isFormValid = computed(() => {
  const hasImage = props.id ?
    (imagePreview.value || form.value.logo) :
    form.value.logo

  return form.value.sobre &&
    form.value.nome &&
    form.value.en_descricao &&
    hasImage
})

const submitForm = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  loading.value = true
  try {
    const formData = new FormData()
    formData.append('nome', form.value.nome)
    formData.append('sobre', form.value.sobre)
    formData.append('en_descricao', form.value.en_descricao)
    formData.append('ativo', form.value.ativo.toString())

    if (form.value.logo) {
      formData.append('logo', form.value.logo)
    }

    await empresaService.updateEmpresa(props.id, formData)

    toast.success('Empresa atualizada com sucesso!')
    setTimeout(() => {
      router.push('/marketplace')
    }, 2500)

  } catch (error) {
    toast.error('Erro ao criar empresa')
    console.error('Error creating empresa:', error)
  } finally {
    loading.value = false
  }
}


const loadEmpresa = async () => {
  if (!props.id) return
  try {
    const response = await empresaService.getEmpresaById(props.id)
    const empresa = response.data
    form.value = {
      nome: empresa.nome || '',
      sobre: empresa.sobre || '',
      en_descricao: empresa.en_descricao || '',
      logo: null,
      ativo: empresa.ativo,
    }

    imagePreview.value = empresa.logoUrl || null

  } catch (error) {
    toast.error('Erro ao carregar Empresa')
  }
}

watch(() => props.id, (newId) => {
  if (newId) {
    loadEmpresa()
  }
})


  onMounted(async () => {
    await loadEmpresa()
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
