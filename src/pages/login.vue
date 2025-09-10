<template>
  <v-container fluid class="fill-height pa-0 d-flex align-center justify-center background-image">
    <v-row class="justify-center align-center w-100 h-100 ma-0">
      <v-col cols="12" sm="8" md="4">
        <v-card elevation="8" min-height="600px" rounded="xl"
          class="px-2 px-md-5 px-md-10 py-6 blur-bg d-flex flex-column justify-center">
          <v-card-title class="text-center d-flex flex-column align-center">
            <v-img src="/src/assets/FITCertify365_Logo1.png" alt="Logo" width="300" contain></v-img>
            <div class="text-h6 font-weight-medium text-grey-darken-2 w-100 text-center mt-10">
              <span class="text-md-h5 font-weight-bold text-white">Bem-vindo de volta!</span>
            </div>
          </v-card-title>

          <v-card-text class="pt-0 mt-5">
            <v-form @submit.prevent="login">
              <label class="text-white text-subtitle-1" for="inputEmail">E-mail</label>
              <v-text-field v-model="data.email" prepend-inner-icon="mdi-email" variant="solo" bg-color="white"
                name="inputEmail" placeholder="E-mail" density="comfortable" class="text-white mt-2"
                rounded="lg"></v-text-field>

              <label class="text-white text-subtitle-1" for="inputSenha">Senha</label>
              <v-text-field v-model="data.senha" prepend-inner-icon="mdi-lock"
                :type="showPassword ? 'text' : 'password'" :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="showPassword = !showPassword" placeholder="Senha" variant="solo" name="inputSenha"
                bg-color="white" density="comfortable" class="text-white mt-2" rounded="lg"></v-text-field>
              <div class="text-start text-subtitle-1">
                <a @click="showModal = true" class="text-white text-decoration-none cursor-pointer">
                  Esqueceu a senha?
                </a>
              </div>

              <v-btn type="submit" size="large" block rounded="lg" height="50px" class="mt-5 color-btn"
                :loading="loading">
                Entrar
              </v-btn>

              <div class="d-flex flex-column text-center mt-10 text-white ga-1">
                <span>Ao clicar em 'Entrar', você concorda com os</span>
                <a href="/politicaPrivacidade" target="_blank" class="text-white font-weight-medium">Termos de Serviço |
                  Política de Privacidade</a>
              </div>
            </v-form>
          </v-card-text>
        </v-card>

        <!-- Modal -->

          <v-dialog v-model="showModal" width="600">
            <v-card rounded="xl">
              <div>
                <v-btn variant="text" width="20px" height="50px">
                  <span @click="showModal = false" class="mdi mdi-window-close text-h5" style="color: #00c6fe;"></span>
                </v-btn>
              </div>
              <v-card-title class="d-flex flex-column justify-center align-center ga-5 mt-5 px-5 px-md-10">
                <span class="mdi mdi-account-lock-outline text-h1" style="color: #00c6fe;"></span>
                <span class="text-h6 text-md-h5 font-weight-bold">Recuperar senha</span>
              </v-card-title>
              <v-card-subtitle class="text-center text-subtitle-2 text-md-subtitle-1"
                style="white-space: normal; word-wrap: break-word;">
                <span>
                  Digite seu e-mail e nós enviaremos um link para redefinir sua senha.
                </span>
              </v-card-subtitle>
              <v-card-text class="px-5 px-md-10 mt-2 mt-md-5">
                <v-text-field v-model="emailModal" type="email" placeholder="Email" hide-details variant="solo"
                  bg-color="white" @blur="() => onBlurEmailModal(emailModal)"
                  :loading="loadingEmailModal"></v-text-field>
              </v-card-text>
              <v-card-actions class="d-flex w-100 flex-column ga-5 px-5 px-md-10 mb-5">
                <v-btn class="w-100 text-white" height="50px" style="background-color: #00c6fe;"
                  :loading="loadingEmailModal" @click="enviarCodigo" :disabled="loadingEmailModal || !validarEmail(emailModal) || !clicouEnviar">Enviar</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import authService from '@/services/auth/auth-service'
import userService from '@/services/users/users-service'
import { ref, watch } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
const router = useRouter()
const data = ref({
  email: '',
  senha: '',
  isMobile: false,
})

const emailModal = ref('');
const loadingEmailModal = ref(false);
const loading = ref(false)
const showPassword = ref(false)
const showModal = ref(false)
const clicouEnviar = ref(false)
let debounceTimer: NodeJS.Timeout | null = null


const login = async () => {
  loading.value = true
  try {
    const response = await authService.login(data.value)
    if (response && response.access_token) {
      sessionStorage.setItem('token', response.access_token)
      const payload = JSON.parse(atob(response.access_token.split('.')[1]))
      const expirationTime = payload.exp * 1000
      const currentTime = Date.now()
      const timeUntilExpiration = expirationTime - currentTime

      if (timeUntilExpiration > 0) {
        setTimeout(() => {
          sessionStorage.removeItem('token')
          router.push('/login')
        }, timeUntilExpiration)
      }

      toast.success('Login realizado com sucesso!', { autoClose: 2500 })
      setTimeout(() => {
        router.push('/')
      }, 2501)
    }
    if(response.response.status! == 401 || 400){
        toast.error('Houve um erro ao fazer login. Verifique suas credenciais.')
    }
  } catch (error) {
    toast.error('Erro ao fazer login. Verifique suas credenciais.')
  } finally {
    loading.value = false
  }
}

const removeToken = () => {
  sessionStorage.removeItem('token')
}


async function enviarCodigo() {
  try {
    await authService.enviarCodigo(emailModal.value).then((resp) => {
      console.log(resp);
      toast.success('Código enviado com sucesso!');
    })

  } catch (error) {
    toast.error('Erro ao enviar código');
  }
}

async function onBlurEmailModal(email: string) {
  if (!email) return;
  clicouEnviar.value = true

  loadingEmailModal.value = true;
  try {
    const response = await userService.validarExisteEmail(email);
    const data = response?.data;

    if (!data?.existeEmail) {
      toast.error('Email não encontrado no sistema');
    } else {
      toast.success('Email encontrado! Clique em enviar para enviarmos o código de verificação.');
    }
  } catch (error) {
    toast.error('Erro ao verificar email');
  } finally {
    loadingEmailModal.value = false;
  }
}

function validarEmail(email: string) {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return re.test(email)
}

watch(emailModal, (newEmail) => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
  
  if (newEmail && validarEmail(newEmail)) {
    debounceTimer = setTimeout(() => {
      onBlurEmailModal(newEmail)
    }, 800)
  }
})


</script>

<style scoped>
.background-image {
  background: url('/src/assets/banner-login.png') no-repeat center center;
  background-size: cover;
}

.blur-bg {
  backdrop-filter: blur(10px);
  background-color: transparent;
}

.color-btn {
  background-color: #00C6FE;
  color: white;
}

.blink-text {
  animation: blink 1.5s infinite;
}
</style>
