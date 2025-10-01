<template>
  <div class="d-flex flex-column justify-center h-100 overflow-hidden">
    <div
      class="py-10 flex-column d-flex align-center justify-center px-5 px-md-10"
    >
      <div class="d-flex align-center pb-5">
        <v-img
          src="/src/assets/Camada_1.png"
          alt="Logo"
          width="250"
          contain
        ></v-img>
      </div>
    </div>

    <v-row
      class="d-flex justify-center px-5 px-md-10 pt-10 bg-light-blue-lighten-5"
    >
      <v-container class="d-flex justify-center flex-column">
        <div class="d-flex text-center justify-center mb-10">
          <h1
            class="text-center text-h4 text-md-h3 font-weight-bold text-blue-grey-darken-4"
          >
            Portal FitCertify365
          </h1>
        </div>

        <v-row>
          <v-col cols="12" md="6" lg="3">
            <v-card class="pb-1 card-hover card-fixed" rounded="xl">
              <v-img
                class="card-img"
                src="/src/assets/Website.jpg"
                cover
              ></v-img>

              <div class="py-5 flex-grow-1">
                <v-card-title
                  class="font-weight-bold text-h5 text-blue-grey-darken-4 card-text"
                >
                  FitCerify WebSite
                </v-card-title>
                <v-card-subtitle class="text-subtitle-1 card-text">
                  Plataforma oficial com informações sobre o FitCertify.
                </v-card-subtitle>
              </div>

              <v-card-actions>
                <v-btn
                  class="bg-blue"
                  block
                  rounded="xl"
                  @click="openFitCertifyWebsite"
                >
                  Acessar
                  <v-icon>mdi-arrow-right</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>

          <v-col cols="12" md="6" lg="3">
            <v-card class="pb-1 card-hover card-fixed" rounded="xl">
              <v-img
                class="card-img"
                src="/src/assets/FIT-CM-ADMIN.jpg"
                cover
              ></v-img>

              <div class="py-5 flex-grow-1">
                <v-card-title
                  class="font-weight-bold text-h5 text-blue-grey-darken-4 card-text"
                >
                  FitCerify ADMIN
                </v-card-title>
                <v-card-subtitle class="text-subtitle-1 card-text">
                  Painel de controle para administradores do sistema.
                </v-card-subtitle>
              </div>

              <v-card-actions>
                <v-btn
                  class="bg-blue"
                  block
                  rounded="xl"
                  @click="openFitCertifyAdmin"
                >
                  Acessar
                  <v-icon>mdi-arrow-right</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>

          <v-col cols="12" md="6" lg="3">
            <v-card class="pb-1 card-hover card-fixed" rounded="xl">
              <v-img
                class="card-img"
                src="/src/assets/fit-ADMIN.jpg"
                cover
              ></v-img>

              <div class="py-5 flex-grow-1">
                <v-card-title
                  class="font-weight-bold text-h5 text-blue-grey-darken-4 card-text"
                >
                  FitCerify PACIENTE | MÉDICO
                </v-card-title>
                <v-card-subtitle class="text-subtitle-1 card-text">
                  Ambiente de acesso para pacientes e profissionais de saúde.
                </v-card-subtitle>
              </div>

              <v-card-actions>
                <v-btn
                  class="bg-blue"
                  block
                  rounded="xl"
                  @click="openFitCertifyPatientDoctor"
                >
                  Acessar
                  <v-icon>mdi-arrow-right</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>

          <v-col cols="12" md="6" lg="3">
            <v-card class="pb-1 card-hover card-fixed" rounded="xl">
              <v-img class="card-img" src="/src/assets/jira.jpg" cover></v-img>

              <div class="py-5 flex-grow-1">
                <v-card-title
                  class="font-weight-bold text-h5 text-blue-grey-darken-4 card-text"
                >
                  FitCerify JIRA
                </v-card-title>
                <v-card-subtitle class="text-subtitle-1 card-text">
                  Gestão de tarefas e acompanhamento de projetos internos.
                </v-card-subtitle>
              </div>

              <v-card-actions>
                <v-btn
                  class="bg-blue"
                  block
                  rounded="xl"
                  @click="openFitCertifyJira"
                >
                  Acessar
                  <v-icon>mdi-arrow-right</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <v-row class="mt-8">
          <v-col class="d-flex justify-center">
            <v-btn class="bg-green" rounded="xl" @click="$router.go(-1)">
              <v-icon>mdi-arrow-left</v-icon>
              Voltar
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
const openFitCertifyWebsite = () => {
  window.open('https://fitcertify365.com/#/', '_blank')
}

const openFitCertifyAdmin = () => {
  window.open('https://fit-certify-cm-admin.vercel.app/login', '_blank')
}

const openFitCertifyPatientDoctor = () => {
  window.open('https://fit-certify-admin.vercel.app/login', '_blank')
}

const openFitCertifyJira = () => {
  window.open(
    'https://fitcertify365.atlassian.net/jira/software/projects/FIT/summary',
    '_blank'
  )
}
</script>

<style scoped>
.card-hover {
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}
.card-hover:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
}

.card-img {
  height: 200px;
  object-fit: cover;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.card-fixed {
  min-height: 450px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1 1 auto;
}

.card-text {
  word-break: break-word;
  white-space: normal;
  text-align: left;
}
</style>
