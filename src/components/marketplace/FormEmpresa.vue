<template>
  <v-card class="form-card" elevation="4">

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
                <v-col class="mt-2" cols="12" md="6">
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
                <v-col class="mt-2" cols="12" md="6">
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
                <v-col class="mt-2" cols="12" md="6">
                  <v-textarea
                    v-model="form.en_sobre"
                    label="Sobre a Empresa"
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
                    <span>A tradução pode não ser 100% precisa.</span>
                  </v-chip>
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
                <v-file-upload
                  v-model="form.logoUrl"
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
            Criar Empresa
          </v-btn>
        </div>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import empresaService from '@/services/empresa/empresa-service'
import 'vue3-toastify/dist/index.css';

const emit = defineEmits(['empresa-saved'])

const router = useRouter()
const loading = ref(false)
const formRef = ref(null)

const tab = ref('one')
const loadingTranslation = ref(false)

const form = ref({
  nome: '',
  sobre: '',
  en_sobre: '',
  logoUrl: null,
  ativo: true,
})

const rules = {
  required: (value) => !!value || 'Campo obrigatório'
}

const isFormValid = computed(() => {
  return form.value.sobre &&
    form.value.nome &&
    form.value.en_sobre
})

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
  if (!form.value.sobre) {
    toast.error('Preencha o campo "Sobre" para traduzir')
    return
  }

  loadingTranslation.value = true
  try {
    if (form.value.sobre) {
      form.value.en_sobre = await traduzirTexto('pt', 'en', form.value.sobre)
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
    formData.append('nome', form.value.nome)
    formData.append('sobre', form.value.sobre)
    formData.append('en_sobre', form.value.en_sobre)
    formData.append('ativo', form.value.ativo.toString())

    if (form.value.logoUrl) {
      formData.append('logo', form.value.logoUrl)
    }

    await empresaService.createEmpresa(formData)

    emit('empresa-saved')
    toast.success('Empresa criado com sucesso!')

    // Reset form and validations
    form.value = {
      nome: '',
      sobre: '',
      en_sobre: '',
      logoUrl: null,
      ativo: true,
    }
    await nextTick()
    formRef.value?.resetValidation()

  } catch (error) {
    toast.error('Erro ao criar empresa')
    console.error('Error creating empresa:', error)
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
