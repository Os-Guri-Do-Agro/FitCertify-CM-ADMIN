<template>
  <v-container style="background-color: #00c6fe" fluid
    class="pa-0 fill-height d-flex flex-column flex-md-row overflow-x-hidden">
    <v-row no-gutters class="h-100">
      <!-- Modal -->
      <v-dialog v-model="showModal" width="600" persistent>
        <v-card rounded="xl" :loading="loading" :disabled="loading">
          <v-btn variant="text" width="20px" height="50px">
            <span @click="voltar" class="mdi mdi-window-close text-h5" style="color: #00c6fe"></span>
          </v-btn>
          <v-card-title class="d-flex flex-column justify-center align-center ga-5 mt-5 px-5 px-md-10">
            <span class="mdi mdi-email-fast-outline text-h1" style="color: #00c6fe"></span>
            <span class="text-h6 text-md-h5 font-weight-bold">Verifique sua conta</span>
          </v-card-title>
          <v-card-subtitle class="text-center text-subtitle-2 text-md-subtitle-1 px-md-10"
            style="white-space: normal; word-wrap: break-word">
            <span>
              Enviamos um código de verificação para o e-mail:
              <span class="font-weight-medium" style="color: #00c6fe">{{
                usuario?.email || 'testeemail@gmail.com'
                }}</span>
            </span>
          </v-card-subtitle>
          <div class="my-5 px-5 px-md-10">
            <!-- 🔹 Agora com binding no código -->
            <v-otp-input v-model="codigo" variant="solo-filled"></v-otp-input>
          </div>
          <v-card-actions class="d-flex w-100 flex-column-reverse ga-5 px-5 px-md-10 mb-5">
            <v-btn class="w-100" height="50px" text @click="voltar">
              Trocar E-mail
            </v-btn>
            <span class="text-subtitle-2">Informou o e-mail errado?</span>
            <v-btn class="w-100 text-white" height="50px" @click="confirmar" style="background-color: #00c6fe"
              :loading="loading" :disabled="loading">
              Confirmar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Coluna da esquerda -->
      <v-col md="4" class="d-flex flex-column justify-center px-10 px-lg-16 h-100">
        <!-- Logo -->
        <div class="mb-8 d-flex justify-center">
          <span class="mdi mdi-lock-reset text-h1 text-white"></span>
        </div>

        <!-- Formulário -->
        <p class="text-white text-center text-subtitle-1 text-md-h6 text-lg-h5 px-lg-10" style="margin-bottom: 1.5rem">
          Redefina sua senha para acessar sua conta.
        </p>

        <v-form class="d-flex align-center flex-column px-lg-0 px-xl-12 h-auto" ref="formRef">
          <v-text-field v-model="novaSenha" :type="showPassword ? 'text' : 'password'"
            :rules="[rules.requiredSenhaObrigatoria]" placeholder="Nova senha" variant="solo" bg-color="white"
            density="comfortable" class="mb-4 w-100" style="border-radius: 5px; color: #1f2937">
            <template #append-inner>
              <v-icon @click="showPassword = !showPassword" class="cursor-pointer">
                {{ showPassword ? 'mdi-eye' : 'mdi-eye-off' }}
              </v-icon>
            </template>
          </v-text-field>

          <v-text-field v-model="confirmarSenha" :type="showPassword2 ? 'text' : 'password'"
            :rules="[rules.requiredSenhaObrigatoria]" placeholder="Confirmar senha" variant="solo" bg-color="white"
            density="comfortable" class="w-100" style="border-radius: 5px; color: #1f2937">
            <template #append-inner>
              <v-icon @click="showPassword2 = !showPassword2" class="cursor-pointer">
                {{ showPassword2 ? 'mdi-eye' : 'mdi-eye-off' }}
              </v-icon>
            </template>
          </v-text-field>

          <VRow class="d-flex w-100 mt-5">
            <div class="d-flex flex-column align-center w-100" cols="12">
              <VBtn class="text-white" block height="47px" style="background-color: #88ce0d" @click="redefinirSenha"
                :loading="loading" :disabled="loading">
                Redefinir Senha
              </VBtn>
              <div class="d-flex flex-column flex-md-row align-center justify-center mt-10">
                <span class="text-white text-md-subtitle-2 text-lg-subtitle-1">Lembrou da senha?</span>
                <button @click="voltar" class="font-weight-bold ml-2 text-subtitle-1 text-align-center text-white">
                  Voltar ao login
                </button>
              </div>
            </div>
          </VRow>
        </v-form>
      </v-col>

      <!-- Coluna da direita -->
      <v-col md="8" class="pa-0 hidden-sm-and-down">
        <v-img src="@/assets/banner-login.png" cover height="100vh" width="100%"></v-img>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import authService from '@/services/auth/auth-service'
import { logout } from '@/utils/auth'
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const showModal = ref(true)
const router = useRoute()
const route = useRouter()

const showPassword = ref(false)
const showPassword2 = ref(false)
const novaSenha = ref('')
const confirmarSenha = ref('')
const codigo = ref('')
const usuario = ref<any>(null)
const loading = ref(false)
const token = ref()
const formRef = ref<any>(null)

// 🔹 Voltar ao login
function voltar() {
  sessionStorage.removeItem('token')
  showModal.value = false
  route.push('/login').then(() => {
    toast.error("Token inválido")
  })
}

// 🔹 Regras de senha
const rules = {
  requiredSenhaObrigatoria: (value: any) => {
    if (!value) return 'Senha obrigatória'
    return (
      validarSenhaForte(value) ||
      'A senha deve ter pelo menos 8 caracteres, uma letra maiúscula, um número e um caractere especial'
    )
  },
}

function validarSenhaForte(senha: string) {
  const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*.])[A-Za-z\d!@#$%^&*.]{8,}$/
  return regex.test(senha)
}

// 🔹 Confirmar código
async function confirmar() {
  if (!codigo.value) {
    toast.error('Informe o código')
    return
  }

  loading.value = true
  await authService
    .validarCodigoEmail({ token: token.value, codigo: codigo.value })
    .then((resp) => {
      if (resp?.success) {
        toast.success(resp?.data)
        showModal.value = false
      } else {
        toast.error(resp?.message)
      }
    })
    .finally(() => (loading.value = false))
}

// 🔹 Redefinir senha
async function redefinirSenha() {
  if (novaSenha.value !== confirmarSenha.value) {
    toast.error('As senhas não coincidem')
    return
  }

  loading.value = true
  await authService
    .forgotPassword({
      codigo: codigo.value,
      senhaNova: novaSenha.value,
      token: token.value,
    })
    .then((resp) => {
      if (resp?.success) {
        route.push('/login').then(() => {
          toast.success(resp?.data)
        })
      } else {
        toast.error(resp?.message)
      }
    })
    .finally(() => (loading.value = false))
}


async function validarToken(tokenParam: string) {
  loading.value = true
  await authService
    .validarToken(tokenParam)
    .then((resp) => {
      if (resp?.success) {
        usuario.value = resp?.data?.usuario
      } else {
        voltar()
      }
    })
    .finally(() => (loading.value = false))
}

onMounted(() => {
  token.value = 'token' in router.params ? router.params.token : undefined
  if (token.value) validarToken(token.value)
})
</script>
