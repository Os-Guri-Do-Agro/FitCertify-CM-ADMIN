<template>
  <v-container fluid class="fill-height pa-0 d-flex align-center justify-center background-image">
    <v-row class="justify-center align-center w-100 h-100 ma-0">
      <v-col cols="12" sm="8" md="4">
        <v-card elevation="10" rounded="xl" class="pa-6">
          <v-card-title class="text-center d-flex flex-column align-center">
            <v-img
              src="/src/assets/Camada_1.png"
              alt="Logo"
              width="150"
              class="mb-3"
              contain
            ></v-img>
            <div class="text-h6 font-weight-medium text-grey-darken-2">
              Bem-vindo de volta
            </div>
          </v-card-title>

          <v-card-text class="pt-0">
            <v-form>
              <v-text-field
                label="Email"
                prepend-inner-icon="mdi-email"
                variant="outlined"
                density="comfortable"
                class="mb-4"
              ></v-text-field>

              <v-text-field
                label="Senha"
                prepend-inner-icon="mdi-lock"
                type="password"
                variant="outlined"
                density="comfortable"
                class="mb-4"
              ></v-text-field>

              <v-btn
                color="primary"
                size="large"
                block
                rounded
                class="mb-3"
                @click="$router.push('/')"
              >
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
.background-image {
  background: url('/src/assets/image-teste-5.png') no-repeat center center;
  background-size: cover;
}
</style>
