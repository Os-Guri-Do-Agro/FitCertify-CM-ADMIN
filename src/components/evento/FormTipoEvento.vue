<template>
  <v-card class="form-card" elevation="4">

    <v-divider></v-divider>

    <v-card-text class="pa-6">
      <v-form ref="formRef" @submit.prevent="submitForm">
        <!-- Basic Information Section -->
        <div class="mb-6">
          <h3 class="text-h6 font-weight-medium mb-4 text-primary">
            <v-icon icon="mdi-information" class="me-2" size="small"></v-icon>
            Informações do Tipo de Evento
          </h3>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.nome"
                label="Nome do Tipo de Evento"
                variant="outlined"
                prepend-inner-icon="mdi-tag"
                :rules="[rules.required]"
                required
                density="comfortable"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.en_nome"
                label="Nome em Inglês"
                variant="outlined"
                prepend-inner-icon="mdi-tag-outline"
                :rules="[rules.required]"
                required
                density="comfortable"
              ></v-text-field>
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
            Criar Tipo de Evento
          </v-btn>
        </div>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
import tipoEventoService from '@/services/tipo-evento/tipo-evento-service'
import { computed, ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const emit = defineEmits(['tipo-evento-saved'])
const router = useRouter()

const loading = ref(false)
const formRef = ref(null)

const form = ref({
  nome: '',
  en_nome: '',
  ativo: true
})

const rules = {
  required: (value) => !!value || 'Campo obrigatório'
}

const isFormValid = computed(() => {
  return form.value.nome && form.value.en_nome
})

const submitForm = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  loading.value = true
  try {
    await tipoEventoService.createTipoEvento(form.value)

    emit('tipo-evento-saved')
    toast.success('Tipo de evento criado com sucesso!')

    // Reset form and validations
    form.value = {
      nome: '',
      en_nome: '',
      ativo: true
    }
    await nextTick()
    formRef.value?.resetValidation()
  } catch (error) {
    toast.error('Erro ao criar tipo de evento')
    console.error('Error creating tipo evento:', error)
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
</style>
