<template>
  <div class="portal-container">
    <!-- Back Button -->
    <v-btn
      variant="elevated"
      color="#00c6fe"
      class="back-button text-white"
      @click="$router.go(-1)"
      prepend-icon="mdi-arrow-left"
    >
      Voltar
    </v-btn>

    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-overlay"></div>
      <v-container class="hero-content">
        <div class="text-center">
          <v-img
            src="/src/assets/Camada_1.png"
            alt="FitCertify365 Logo"
            width="320"
            class="mx-auto mb-8 logo-glow"
            contain
          ></v-img>
        </div>
      </v-container>
    </section>

    <!-- Services Section -->
    <section class="services-section">
      <v-container>
        <div class="section-header text-center mb-12">
          <h2 class="section-title mb-4">Ecossistema de Plataformas</h2>
          <p class="section-subtitle">
            Acesse todas as ferramentas do FitCertify365 em um só lugar
          </p>
        </div>

        <v-row class="justify-center">
          <v-col
            cols="12"
            sm="6"
            lg="3"
            v-for="service in services"
            :key="service.id"
          >
            <v-card class="service-card" elevation="0" @click="service.action">
              <div class="service-image-container">
                <v-img :src="service.image" class="service-image" cover>
                  <div class="image-overlay"></div>
                  <div class="service-icon-overlay">
                    <v-avatar
                      :color="service.color"
                      size="60"
                      class="service-icon"
                    >
                      <v-icon
                        :icon="service.icon"
                        size="30"
                        color="white"
                      ></v-icon>
                    </v-avatar>
                  </div>
                </v-img>
              </div>

              <v-card-title class="service-title">
                {{ service.title }}
              </v-card-title>

              <v-card-text class="service-description">
                {{ service.description }}
              </v-card-text>

              <div class="service-footer">
                <v-chip
                  :color="service.status === 'online' ? 'success' : 'warning'"
                  size="small"
                  variant="flat"
                >
                  <v-icon start size="12">
                    {{
                      service.status === 'online'
                        ? 'mdi-circle'
                        : 'mdi-circle-outline'
                    }}
                  </v-icon>
                  {{ service.status === 'online' ? 'Online' : 'Manutenção' }}
                </v-chip>

                <v-btn
                  :color="service.color"
                  variant="text"
                  size="small"
                  class="service-btn"
                >
                  Acessar
                  <v-icon end>mdi-arrow-right</v-icon>
                </v-btn>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>
  </div>
</template>

<script lang="ts" setup>
const services = [
  {
    id: 1,
    title: 'Portal Institucional',
    description:
      'Plataforma oficial com informações corporativas e serviços públicos.',
    icon: 'mdi-web',
    color: 'primary',
    status: 'online',
    image: '/Website.jpg',
    action: () => window.open('https://fitcertify365.com/#/', '_blank'),
  },
  {
    id: 2,
    title: 'Painel Administrativo',
    description:
      'Centro de controle para gestão completa do sistema e usuários.',
    icon: 'mdi-view-dashboard',
    color: 'success',
    status: 'online',
    image: '/FIT-CM-ADMIN.jpg',
    action: () =>
      window.open('https://fit-certify-cm-admin.vercel.app/login', '_blank'),
  },
  {
    id: 3,
    title: 'Portal do Atleta e Médico',
    description:
      'Ambiente especializado para profissionais de saúde e pacientes.',
    icon: 'mdi-medical-bag',
    color: 'info',
    status: 'online',
    image: '/fit-ADMIN.jpg',
    action: () =>
      window.open('https://fit-certify-admin.vercel.app/login', '_blank'),
  },
  {
    id: 4,
    title: 'Gestão de Projetos',
    description:
      'Ferramenta avançada para acompanhamento e controle de projetos.',
    icon: 'mdi-clipboard-list',
    color: 'warning',
    status: 'online',
    image: '/jira.jpg',
    action: () =>
      window.open(
        'https://fitcertify365.atlassian.net/jira/software/projects/FC/summary',
        '_blank'
      ),
  },
]
</script>

<style scoped>
.portal-container {
  min-height: 100vh;
}
.hero-section {
  position: relative;
  display: flex;
  align-items: center;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="%23ffffff" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
}

.hero-content {
  position: relative;
  z-index: 2;
}

.logo-glow {
  filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.3));
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  line-height: 1.2;
}

.gradient-text {
  background: linear-gradient(45deg, #00c6fe, #0072ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.9);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.status-chip {
  font-weight: 600;
  padding: 8px 16px;
}

.services-section {
  padding: 80px 0;
  background: #f8fafc;
}

.section-header {
  margin-bottom: 60px;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 16px;
}

.section-subtitle {
  font-size: 1.125rem;
  color: #64748b;
  max-width: 600px;
  margin: 0 auto;
}

.service-card {
  background: white;
  border-radius: 20px;
  padding: 32px 24px 24px 24px;
  text-align: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border: 1px solid #e2e8f0;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.service-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  border-color: transparent;
}

.service-image-container {
  position: relative;
  height: 180px;
  margin: -32px -24px 24px -24px;
  border-radius: 20px 20px 0 0;
  overflow: hidden;
}

.service-image {
  height: 100%;
  transition: transform 0.3s ease;
}

.service-card:hover .service-image {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.4) 0%,
    rgba(0, 0, 0, 0.6) 100%
  );
  z-index: 1;
}

.service-icon-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
}

.service-icon {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.service-card:hover .service-icon {
  transform: scale(1.1);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
}

.service-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 12px;
  line-height: 1.4;
}

.service-description {
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 24px;
  flex-grow: 1;
}

.service-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.service-btn {
  font-weight: 600;
  text-transform: none;
}

.back-button {
  position: fixed;
  top: 24px;
  left: 24px;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .service-card {
    margin-bottom: 24px;
  }
}
</style>
