<template>
  <v-card class="pa-6">
    <v-card-title class="text-h5 mb-4">Criar Nova Empresa</v-card-title>

    <v-form ref="formRef" @submit.prevent="submitForm">

      <v-row>

        <v-col cols="6">
          <v-text-field v-model="form.nome" label="Nome" :rules="[rules.required]" variant="outlined"
            class="mb-3"></v-text-field>
          <v-textarea v-model="form.sobre" label="Sobre" :rules="[rules.required]" variant="outlined"
            class="mb-3"></v-textarea>
          <v-col>


              <v-card variant="outlined" class="pa-2  ">
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
          <v-card variant="outlined" class="pa-4 ">
              <v-card-subtitle class="pa-0 mb-3">Imagem da Empresa</v-card-subtitle>
          <v-file-upload v-model="form.logoUrl" label="Selecionar imagem" clearable show-size accept="image/*"
            variant="outlined"></v-file-upload>
            </v-card>
        </v-col>
        <v-col cols="12">

        </v-col>

      </v-row>

      <v-divider class="my-6"></v-divider>

      <v-row>
        <v-col class="d-flex  justify-space-between ">
          <v-btn variant="outlined" @click="router.push('/marketplace/')" size="large">
            Cancelar
          </v-btn>

          <v-btn :disabled="!isFormValid" @click="submitForm" color="primary" :loading="loading" size="large">
            Criar Empresa
          </v-btn>

        </v-col>
      </v-row>
    </v-form>
  </v-card>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import empresaService from '@/services/empresa/empresa-service'
// import categoriaArtigoService from '@/services/categoria-artigo/categoria-artigo-service'
import 'vue3-toastify/dist/index.css';

const router = useRouter()
const loading = ref(false)
const formRef = ref(null)

const form = ref({
  nome: '',
  sobre: '',
  logoUrl: null,
  ativo: true,
})

const rules = {
  required: (value) => !!value || 'Campo obrigatório'
}

const isFormValid = computed(() => {
  return  form.value.sobre &&
    form.value.nome

})

const submitForm = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  loading.value = true
  try {
    const formData = new FormData()
    formData.append('nome', form.value.nome)
    formData.append('sobre', form.value.sobre)
    formData.append('ativo', form.value.ativo.toString())

    if (form.value.logoUrl) {
      formData.append('logo', form.value.logoUrl)
    }


    await empresaService.createEmpresa(formData)

    toast.success('Empresa criado com sucesso!')
    setTimeout(() => {
      router.push('/empresa/')

    }, 2500)

  } catch (error) {
    toast.error('Erro ao criar empresa')
    console.error('Error creating empresa:', error)
  } finally {
    loading.value = false
  }
}

</script>
