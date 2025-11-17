<template>
  <v-container fluid class="pa-6">
    <v-row class="mb-6">
      <v-col cols="12">
        <div class="header-content">
          <h1 class="text-h3 font-weight-bold text-primary mb-2">
            <v-icon icon="mdi-cog" class="me-3" size="large"></v-icon>
            Configurações
          </h1>
          <p class="text-subtitle-1 text-medium-emphasis mb-0">
            Altere sua senha de acesso
          </p>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" lg="8">
        <!-- First Access Warning -->
        <v-alert
          v-if="isFirstAccess"
          type="warning"
          variant="tonal"
          class="mb-4"
          closable
          @click:close="isFirstAccess = false"
        >
          <strong>Caso seja o primeiro acesso,</strong> recomendamos fortemente que altere sua senha padrão por uma senha forte.
        </v-alert>

        <v-card class="main-card" elevation="3">
          <v-card-title class="pa-6 pb-4">
            <div class="d-flex align-center">
              <v-avatar color="orange" size="40" class="me-3">
                <v-icon color="white" size="20">mdi-key</v-icon>
              </v-avatar>
              <div>
                <div class="text-h6 font-weight-medium">Alterar Senha</div>
                <div class="text-caption text-medium-emphasis">Atualize sua senha de acesso</div>
              </div>
            </div>
          </v-card-title>

          <v-divider></v-divider>

          <v-card-text class="pa-6">
            <v-form ref="passwordForm">
              <v-text-field
                v-model="passwordData.currentPassword"
                label="Senha Atual"
                :type="showCurrentPassword ? 'text' : 'password'"
                variant="outlined"
                density="comfortable"
                class="mb-4"
                :rules="[rules.required]"
                :append-inner-icon="showCurrentPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="showCurrentPassword = !showCurrentPassword"
              ></v-text-field>

              <v-text-field
                v-model="passwordData.newPassword"
                label="Nova Senha"
                :type="showNewPassword ? 'text' : 'password'"
                variant="outlined"
                density="comfortable"
                class="mb-2"
                :rules="[rules.required, rules.strongPassword]"
                :append-inner-icon="showNewPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="showNewPassword = !showNewPassword"
              ></v-text-field>

              <!-- Password Strength Indicator -->
              <div class="mb-4">
                <div class="d-flex align-center mb-2">
                  <span class="text-caption me-2">Força da senha:</span>
                  <v-chip :color="passwordStrength.color" size="small" variant="flat">
                    {{ passwordStrength.text }}
                  </v-chip>
                </div>
                <v-progress-linear
                  :model-value="passwordStrength.score * 25"
                  :color="passwordStrength.color"
                  height="4"
                  rounded
                ></v-progress-linear>
              </div>

              <v-text-field
                v-model="passwordData.confirmPassword"
                label="Confirmar Nova Senha"
                :type="showConfirmPassword ? 'text' : 'password'"
                variant="outlined"
                density="comfortable"
                class="mb-4"
                :rules="[rules.required, rules.passwordMatch]"
                :append-inner-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="showConfirmPassword = !showConfirmPassword"
              ></v-text-field>

              <v-btn
                color="primary"
                variant="elevated"
                @click="changePassword"
                :loading="changingPassword"
                :disabled="!isPasswordStrong"
                size="large"
                block
              >
                <v-icon start>mdi-check</v-icon>
                Alterar Senha
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Sidebar -->
      <v-col cols="12" lg="4">
        <v-card elevation="3" class="sidebar-card">
          <v-card-title class="pa-4">
            <div class="d-flex align-center">
              <v-icon icon="mdi-information" class="me-2" color="primary"></v-icon>
              <span class="text-h6 font-weight-medium">Requisitos</span>
            </div>
          </v-card-title>

          <v-divider></v-divider>

          <v-card-text class="pa-4">
            <div class="text-subtitle-2 mb-3">Para senha forte:</div>
            <ul class="requirements-list">
              <li>Mínimo 8 caracteres</li>
              <li>Pelo menos 1 letra maiúscula</li>
              <li>Pelo menos 1 letra minúscula</li>
              <li>Pelo menos 1 número</li>
              <li>Pelo menos 1 caractere especial</li>
            </ul>


          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import authService from '@/services/auth/auth-service'
import { ref, computed } from 'vue'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const passwordForm = ref<any>(null)
const changingPassword = ref(false)
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const isFirstAccess = ref(true) // This would come from user data

const passwordData = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const checkPasswordStrength = (password: string) => {
  if (!password) return { score: 0, text: 'Muito Fraca', color: 'error' }

  const hasMinLength = password.length >= 8
  const hasLower = /[a-z]/.test(password)
  const hasUpper = /[A-Z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password)
  const hasLongLength = password.length >= 12
  const hasMultipleSpecial = (password.match(/[!@#$%^&*(),.?":{}|<>]/g) || []).length >= 2

  // Forte = todos os básicos + especial
  const isStrong = hasMinLength && hasLower && hasUpper && hasNumber && hasSpecial

  // Muito Forte = forte + 12+ chars + múltiplos especiais
  const isVeryStrong = isStrong && hasLongLength && hasMultipleSpecial

  if (isVeryStrong) return { score: 5, text: 'Muito Forte', color: 'success' }
  if (isStrong) return { score: 4, text: 'Forte', color: 'success' }

  let score = 0
  if (hasMinLength) score++
  if (hasLower) score++
  if (hasUpper) score++
  if (hasNumber) score++

  const levels = [
    { score: 0, text: 'Muito Fraca', color: 'error' },
    { score: 1, text: 'Fraca', color: 'error' },
    { score: 2, text: 'Regular', color: 'warning' },
    { score: 3, text: 'Boa', color: 'orange' }
  ]

  return levels[score] || levels[3]
}

const passwordStrength = computed(() => checkPasswordStrength(passwordData.value.newPassword))
const isPasswordStrong = computed(() => passwordStrength.value.score >= 4)

const rules = {
  required: (value: any) => !!value || 'Campo obrigatório',
  strongPassword: (value: string) => {
    if (!value) return 'Campo obrigatório'
    const strength = checkPasswordStrength(value)
    return strength.score >= 4 || 'Senha deve ser forte (mínimo 4/5 critérios)'
  },
  passwordMatch: (value: string) => value === passwordData.value.newPassword || 'Senhas não coincidem'
}

const changePassword = async () => {
  const { valid } = await passwordForm.value.validate()
  if (!valid || !isPasswordStrong.value) return

  changingPassword.value = true
  try {
    await authService.forgotPasswordLogado({
      senhaAtual: passwordData.value.currentPassword,
      senhaNova: passwordData.value.newPassword
    })

    toast.success('Senha alterada com sucesso!')
    passwordData.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
    passwordForm.value.resetValidation()
    isFirstAccess.value = false
  } catch (error) {
    toast.error('Erro ao alterar senha. Tente novamente.')
    console.error('Erro ao alterar senha:', error)
  } finally {
    changingPassword.value = false
  }
}
</script>

<style scoped>
.header-content {
  text-align: center;
}

.main-card {
  border-radius: 16px;
  overflow: hidden;
}

.sidebar-card {
  border-radius: 16px;
  overflow: hidden;
}

.requirements-list {
  list-style: none;
  padding: 0;
}

.requirements-list li {
  padding: 4px 0;
  position: relative;
  padding-left: 20px;
}

.requirements-list li::before {
  content: '•';
  color: var(--v-theme-primary);
  position: absolute;
  left: 0;
}

:deep(.v-field--variant-outlined) {
  border-radius: 12px;
}

@media (max-width: 600px) {
  .header-content h1 {
    font-size: 1.75rem !important;
  }
}
</style>
