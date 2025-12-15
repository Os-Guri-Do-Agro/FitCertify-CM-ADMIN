<template>
  <v-card class="form-card" elevation="4">

    <v-divider></v-divider>

    <v-card-text class="pa-6">
      <v-form ref="formRef" @submit.prevent="submitForm">
        <!-- Basic Information Section -->
        <div class="mb-6">
          <h3 class="text-h6 font-weight-medium mb-4 text-primary">
            <v-icon icon="mdi-information" class="me-2" size="small"></v-icon>
            Informações da Categoria
          </h3>
          <v-row>
            <v-col class="mt-2" cols="12" md="6">
              <v-text-field
                v-model="form.nome"
                label="Nome da Categoria"
                variant="outlined"
                prepend-inner-icon="mdi-tag"
                :rules="[rules.required]"
                required
                density="comfortable"
              ></v-text-field>
            </v-col>
            <v-col class="mt-2" cols="12" md="6">
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
                  Categoria visível no sistema
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
            Criar Categoria
          </v-btn>
        </div>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import categoriaProdutoService from '@/services/categoria-produto/categoria-produto-service'

interface CategoriaForm {
  nome: string
  en_nome: string
  ativo: boolean
}

interface Emits {
  (e: 'categoria-saved'): void
}

const emit = defineEmits<Emits>()
const router = useRouter()

const loading = ref(false)
const formRef = ref(null)

const form = ref<CategoriaForm>({
  nome: '',
  en_nome: '',
  ativo: true
})

const rules = {
  required: (value: string) => !!value || 'Campo obrigatório'
}

const isFormValid = computed(() => {
  return form.value.nome && form.value.en_nome
})

const submitForm = async () => {
  if (!formRef.value) return

  const { valid } = await (formRef.value as any).validate()
  if (!valid) return

  loading.value = true
  try {
    await categoriaProdutoService.creatCateforiaProduto(form.value)
    toast.success('Categoria criada com sucesso!')

    emit('categoria-saved')
    form.value = { nome: '', en_nome: '', ativo: true }
    await nextTick()
    ;(formRef.value as any)?.resetValidation()
  } catch (error) {
    toast.error('Erro ao criar categoria')
    console.error('Error saving categoria:', error)
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
</style>
