<template>
  <v-container class="fill-height">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12 login-card">
          <v-card-title class="text-center pa-6">
            <div class="text-h4 font-weight-bold text-primary mb-2">Nome Empresa</div>
            <div class="text-subtitle-1 text-grey-darken-1">Admin Login</div>
          </v-card-title>

          <v-card-text class="pa-6">
            <v-form>
              <v-text-field label="Email" prepend-inner-icon="mdi-email" variant="outlined" class="mb-3"></v-text-field>

              <v-text-field label="Senha" prepend-inner-icon="mdi-lock" type="password" variant="outlined"
                class="mb-4"></v-text-field>

              <v-btn color="primary" size="large" block class="mb-3" @click="$router.push('/')">
                Entrar
              </v-btn>

              <div class="text-center">
                <a href="#" class="text-primary text-decoration-none">
                  Esqueceu a senha?
                </a>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.login-card {
  border-radius: 16px;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
}
</style>
