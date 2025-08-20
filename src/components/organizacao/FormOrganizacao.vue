<template>
  <v-card class="pa-6">
    <v-card-title class="text-h5 mb-4">Criar Nova Organização</v-card-title>

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
            <v-file-upload
              v-model="form.logo"
              label="Selecionar imagem"
              clearable
              show-size
              accept="image/*"
              variant="outlined"
            ></v-file-upload>
          </v-card>
        </v-col>
        <v-col cols="12"> </v-col>
      </v-row>

      <v-divider class="my-6"></v-divider>

      <v-row>
        <v-col class="d-flex justify-space-between">
          <v-btn
            variant="outlined"
            @click="router.push('/organizacao')"
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
            Criar Organização
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-card>
</template>

<script setup>
import organizacaoService from '@/services/organizacao-evento/organizacao-evento-service'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'

import 'vue3-toastify/dist/index.css'

const router = useRouter()
const loading = ref(false)
const formRef = ref(null)

const form = ref({
  nome: '',
  sobre: '',
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

    console.log(formData)

    await organizacaoService.createOrganizacao(formData)

    toast.success('Organizacao criado com sucesso!')
    setTimeout(() => {
      router.push('/organizacao')
    }, 2500)
  } catch (error) {
    toast.error('Erro ao criar organizacao')
    console.error('Error creating organizacao:', error)
  } finally {
    loading.value = false
  }
}
</script>
