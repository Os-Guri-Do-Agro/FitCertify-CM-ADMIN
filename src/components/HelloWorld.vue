<template>
  <div class="hero-section">
    <div class="admin-header">
            <!-- Logo e Título -->
            <div class="header-brand mb-8">
              <div class="d-flex align-center justify-center mb-4">
                <v-avatar size="75" class="mr-5">
                  <v-img src="/favicon.png"></v-img>
                </v-avatar>
                <div class="text-left">
                  <h1 class="text-h4 text-md-h3 font-weight-bold text-white mb-1">
                    FitCertify365
                  </h1>
                  <p class="text-subtitle-1 admin-subtitle mb-0 text-center text-md-start">
                    Painel Administrativo
                  </p>
                </div>
              </div>
            </div>

            <!-- Informações do Sistema -->
            <div class="system-info">
              <v-row>
                <v-col cols="12" md="4">
                  <div class="info-card">
                    <v-icon icon="mdi-cog" size="24" class="mb-2"></v-icon>
                    <h3 class="text-h6 font-weight-bold mb-2">Gestão Completa</h3>
                    <p class="text-body-2">Controle total sobre usuários, certificações e conteúdo</p>
                  </div>
                </v-col>
                <v-col cols="12" md="4">
                  <div class="info-card">
                    <v-icon icon="mdi-security" size="24" class="mb-2"></v-icon>
                    <h3 class="text-h6 font-weight-bold mb-2">Segurança Avançada</h3>
                    <p class="text-body-2">Acesso controlado com diferentes níveis de permissão</p>
                  </div>
                </v-col>
                <v-col cols="12" md="4">
                  <div class="info-card">
                    <v-icon icon="mdi-chart-line" size="24" class="mb-2"></v-icon>
                    <h3 class="text-h6 font-weight-bold mb-2">Analytics</h3>
                    <p class="text-body-2">Relatórios detalhados e métricas <br> em tempo real</p>
                  </div>
                </v-col>
              </v-row>
            </div>

            <!-- Recursos Principais -->
            <div class="features-section mt-8">
              <v-row>
                <v-col cols="12" sm="6" md="3">
                  <div class="feature-item" @click="$router.push('/evento')">
                    <v-icon icon="mdi-calendar-multiple" size="20" class="mr-2"></v-icon>
                    <span class="feature-text">Eventos</span>
                  </div>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                  <div class="feature-item" @click="$router.push('/organizacao')">
                    <v-icon icon="mdi-calendar-multiple" size="20" class="mr-2"></v-icon>
                    <span class="feature-text">Organização</span>
                  </div>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                  <div class="feature-item" @click="$router.push('/artigos/')">
                    <v-icon icon="mdi-post-outline" size="20" class="mr-2"></v-icon>
                    <span class="feature-text">Artigos</span>
                  </div>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                  <div class="feature-item" @click="$router.push('/marketplace')">
                    <v-icon icon="mdi-shopping-outline" size="20" class="mr-2"></v-icon>
                    <span class="feature-text">Marketplace</span>
                  </div>
                </v-col>
              </v-row>
            </div>

            <!-- Status do Sistema -->
            <div class="system-status mt-6">
              <div class="status-indicator">
                <v-chip color="success" variant="elevated" size="small" class="mr-4">
                  <v-icon start icon="mdi-check-circle"></v-icon>
                  Sistema Online
                </v-chip>
              </div>
            </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, #004064 0%, #009ece 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.3;
}

.admin-header {
  position: relative;
  z-index: 2;
  animation: fadeInUp 1s ease-out;
  padding: 3rem 2rem 3rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.header-brand {
  text-align: center;
}

.brand-logo {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.brand-logo .v-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.admin-subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.system-info, .features-section {
  margin-top: 2rem;
  margin-left: 4em;
}

.system-info .v-row {
  margin: 0 -12px;
}

.features-section .v-row {
  margin: 0 -12px;
}

.features-section {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.feature-item {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.feature-item:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateX(4px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.feature-item .v-icon {
  color: rgba(255, 255, 255, 0.9);
}

.feature-text {
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  font-size: 0.875rem;
}

.info-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 1.5rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  min-height: 140px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.info-card:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-4px);
}

.info-card .v-icon {
  color: rgba(255, 255, 255, 0.9);
  align-self: center;
}

.info-card h3 {
  color: white;
}

.info-card p {
  color: rgba(255, 255, 255, 0.8);
}

.system-status {
  text-align: center;
}

.status-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .hero-section {
    overflow-y: auto;
    height: auto;
    min-height: 100vh;
    align-items: flex-start;
  }

  .admin-header {
    width: 100%;
    padding: 1rem;
  }

  .system-info,
  .features-section {
    margin-left: 5em;
  }

  .header-brand .d-flex {
    flex-direction: column;
    text-align: center;
  }

  .brand-logo {
    margin-right: 0 !important;
    margin-bottom: 1rem;
  }

  .status-indicator {
    flex-direction: column;
  }
}
</style>
