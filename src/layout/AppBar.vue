<template>
  <v-app-bar color="transparent" :elevation="0" class="modern-app-bar" height="80">
    <div class="app-bar-content">
      <!-- Left Section -->
      <div class="left-section">
        <v-btn icon variant="text" @click="layoutStore.toggleRail()" class="menu-btn" size="large">
          <v-icon size="24">mdi-menu</v-icon>
        </v-btn>

        <div class="page-info">
          <h2 class="page-title">{{ currentPageTitle }}</h2>
          <div class="breadcrumb">
            <span class="breadcrumb-item">FitCertify</span>
            <v-icon size="12" class="breadcrumb-separator">mdi-chevron-right</v-icon>
            <span class="breadcrumb-current">{{ currentPageTitle }}</span>
          </div>
        </div>
      </div>

      <!-- Center Section - Search -->
      <div class="center-section">
        <div class="search-container" :class="{ 'search-expanded': searchExpanded }">
          <v-text-field v-model="searchQuery" placeholder="Buscar..." variant="solo" density="compact" hide-details
            class="search-field" @focus="searchExpanded = true" @blur="searchExpanded = false">
            <template v-slot:prepend-inner>
              <v-icon color="grey-darken-1">mdi-magnify</v-icon>
            </template>
            <template v-slot:append-inner>
              <v-btn v-if="searchQuery" icon size="small" variant="text" @click="searchQuery = ''">
                <v-icon size="16">mdi-close</v-icon>
              </v-btn>
            </template>
          </v-text-field>
        </div>
      </div>

      <!-- Right Section -->
      <div class="right-section">
        <!-- Quick Actions -->
        <v-btn icon variant="text" class="action-btn" @click="toggleFullscreen">
          <v-icon>{{ isFullscreen ? 'mdi-fullscreen-exit' : 'mdi-fullscreen' }}</v-icon>
        </v-btn>

        <!-- Notifications -->
        <v-menu offset-y>
          <template v-slot:activator="{ props }">
            <v-btn icon variant="text" v-bind="props" class="action-btn notification-btn">
              <v-badge :content="notificationCount" :model-value="notificationCount > 0" color="error" offset-x="-8"
                offset-y="8">
                <v-icon>mdi-bell-outline</v-icon>
              </v-badge>
            </v-btn>
          </template>

          <v-card class="notification-menu" min-width="320">
            <v-card-title class="pa-4 pb-2">
              <div class="d-flex align-center justify-space-between">
                <span class="text-h6">Notificações</span>
                <v-chip size="small" color="primary">{{ notificationCount }}</v-chip>
              </div>
            </v-card-title>

            <v-divider></v-divider>

            <v-list class="pa-0" max-height="300">
              <v-list-item v-for="notification in notifications" :key="notification.id" class="notification-item">
                <template v-slot:prepend>
                  <v-avatar :color="notification.color" size="32">
                    <v-icon color="white" size="16">{{ notification.icon }}</v-icon>
                  </v-avatar>
                </template>

                <v-list-item-title class="text-body-2">{{ notification.title }}</v-list-item-title>
              </v-list-item>
            </v-list>

            <v-divider></v-divider>

            <!-- <v-card-actions class="pa-3">
              <v-btn variant="text" size="small" block>
                Ver todas notificações
              </v-btn>
            </v-card-actions> -->
          </v-card>
        </v-menu>

        <!-- User Menu -->
        <v-menu offset-y>
          <template v-slot:activator="{ props }">
            <div class="user-section" v-bind="props">
              <div class="user-info">
                <div class="user-name">{{ infoUser?.user?.nome || 'Usuário' }}</div>
                <div class="user-role">{{ mappedRole() }}</div>
              </div>
              <v-avatar size="40" class="user-avatar">
                <v-img src="https://randomuser.me/api/portraits/men/85.jpg"></v-img>
              </v-avatar>
              <v-icon size="16" class="dropdown-icon">mdi-chevron-down</v-icon>
            </div>
          </template>

          <v-card class="user-menu" min-width="240">
            <v-card-text class="pa-4">
              <div class="d-flex align-center mb-3">
                <v-avatar size="48" class="me-3">
                  <v-img src="https://randomuser.me/api/portraits/men/85.jpg"></v-img>
                </v-avatar>
                <div>
                  <div class="text-subtitle-1 font-weight-medium">{{ infoUser?.user?.nome }}</div>
                  <div class="text-caption text-medium-emphasis">{{infoUser?.user?.email}}</div>
                </div>
              </div>
            </v-card-text>

            <v-divider></v-divider>

            <v-list class="pa-0">
              <v-list-item v-for="item in userMenuItems" :key="item.title" :prepend-icon="item.icon" :title="item.title"
                @click="item.action" class="user-menu-item"></v-list-item>
            </v-list>
          </v-card>
        </v-menu>
      </div>
    </div>
  </v-app-bar>
</template>

<script setup>
import { useLayoutStore } from '@/stores/layout'
import { getInfoUser } from '@/utils/auth'
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const layoutStore = useLayoutStore()
const route = useRoute()
const router = useRouter()

const searchQuery = ref('')
const searchExpanded = ref(false)
const isFullscreen = ref(false)
const notificationCount = ref(0)
const infoUser = ref()
const roleUser = ref()

onMounted(async () => {
  infoUser.value = getInfoUser()
})
function mappedRole() {

  const subRole = {
    financeiro: 'Financeiro',
    marketing: 'Marketing',
    admin: 'Administrador',
    organizador: 'Organizador',
    blog: 'Blog',
    marketplace: 'Marketplace',
  }
  return subRole[infoUser.value?.subRole] || 'Contatar Suporte'
}



const currentPageTitle = computed(() => {
  const titles = {
    '/': 'Dashboard',
    '/users': 'Usuários',
    '/users/atletas': 'Atletas',
    '/users/medicos/': 'Médicos',
    '/evento': 'Eventos',
    '/evento/form': 'Novo Evento',
    '/evento/editForm': 'Editar Evento',
    '/artigos/': 'Artigos',
    '/artigos/form': 'Novo Artigo',
    '/artigos/editForm': 'Editar Artigo',
    '/organizacao/form': 'Nova Organização',
    '/organizacao/editForm': 'Editar Organização',
    '/organizacao': 'Organizações',
    '/marketplace': 'Marketplace',
    '/marketplace/form': 'Novo Marketplace',
    '/marketplace/editForm': 'Editar Marketplace',
    '/empresa': 'Empresa',
    '/empresa/form': 'Nova Empresa',
    '/empresa/editForm': 'Editar Empresa',
    '/cupom': 'Cupom',
    '/solicitacoes': 'Solicitações',
    '/assinaturas': 'Assinaturas',
    '/auditoria': 'Auditoria',
    '/configuracoes/': 'Configurações',
    '/afiliados': 'Afiliados',
    '/afiliados/form': 'Novo Afiliado',
    '/afiliados/editForm': 'Editar Afiliado',
  }
  return titles[route.path] || 'Dashboard'
})

const notifications = ref([
  {
    id: 1,
    title: 'Sem notificações no momento',
    icon: 'mdi-check',
    color: 'success'
  },

])

const userMenuItems = ref([

  {
    title: 'Configurações',
    icon: 'mdi-cog',
    action: () => router.push('/configuracoes')
  },

  {
    title: 'Sair',
    icon: 'mdi-logout',
    action: () => {
      sessionStorage.removeItem('token')
      window.location.href = '/login'
    }
  }
])

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
    isFullscreen.value = true
  } else {
    document.exitFullscreen()
    isFullscreen.value = false
  }
}
</script>

<style scoped>
.modern-app-bar {
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08) !important;
}

.app-bar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 24px;
  height: 100%;
}

.left-section {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.menu-btn {
  background: rgba(var(--v-theme-primary), 0.1) !important;
  border-radius: 12px !important;
  transition: all 0.3s ease;
}

.menu-btn:hover {
  background: rgba(var(--v-theme-primary), 0.2) !important;
  transform: scale(1.05);
}

.page-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
  line-height: 1.2;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
}

.breadcrumb-item {
  color: #666;
  font-weight: 500;
}

.breadcrumb-separator {
  color: #999;
}

.breadcrumb-current {
  color: var(--v-theme-primary);
  font-weight: 600;
}

.center-section {
  flex: 1;
  display: flex;
  justify-content: center;
  max-width: 400px;
}

.search-container {
  width: 280px;
  transition: all 0.3s ease;
}

.search-expanded {
  width: 350px;
}

.search-field {
  border-radius: 25px !important;
}

:deep(.search-field .v-field) {
  border-radius: 25px !important;
  background: rgba(0, 0, 0, 0.04) !important;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.06);
}

:deep(.search-field .v-field--focused) {
  background: white !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
}

.right-section {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  justify-content: flex-end;
}

.action-btn {
  border-radius: 12px !important;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: rgba(var(--v-theme-primary), 0.1) !important;
  transform: translateY(-2px);
}

.notification-btn {
  position: relative;
}

.user-section {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  border-radius: 20px;
  background: rgba(var(--v-theme-primary), 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(var(--v-theme-primary), 0.1);
}

.user-section:hover {
  background: rgba(var(--v-theme-primary), 0.1);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.2);
}

.user-info {
  text-align: right;
  display: none;
}

.user-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1a1a1a;
  line-height: 1.2;
}

.user-role {
  font-size: 0.75rem;
  color: #666;
  font-weight: 500;
}

.user-avatar {
  border: 2px solid rgba(var(--v-theme-primary), 0.2);
  transition: all 0.3s ease;
}

.user-section:hover .user-avatar {
  border-color: var(--v-theme-primary);
  transform: scale(1.05);
}

.dropdown-icon {
  color: #666;
  transition: transform 0.3s ease;
}

.user-section:hover .dropdown-icon {
  transform: rotate(180deg);
}

.notification-menu,
.user-menu {
  border-radius: 16px !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12) !important;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.notification-item,
.user-menu-item {
  border-radius: 8px;
  margin: 4px 8px;
  transition: all 0.2s ease;
}

.notification-item:hover,
.user-menu-item:hover {
  background: rgba(var(--v-theme-primary), 0.05) !important;
}

@media (min-width: 960px) {
  .user-info {
    display: block;
  }
}

@media (max-width: 768px) {
  .center-section {
    display: none;
  }

  .page-info {
    display: none;
  }

  .app-bar-content {
    padding: 0 16px;
  }
}
</style>
