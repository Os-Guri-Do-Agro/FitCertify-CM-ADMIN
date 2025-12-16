<template>
  <v-navigation-drawer
    v-model="layoutStore.drawer"
    :rail="layoutStore.rail"
    permanent
    @click="layoutStore.rail && layoutStore.toggleRail()"
    class="clean-drawer"
    color=""
    rail-width="72"
    style="
      position: fixed !important;
      height: 100vh !important;
      top: 0;
      left: 0;
    "
  >
    <div class="pa-4 text-center header-section">
      <v-avatar v-if="layoutStore.rail" size="36">
        <v-img src="/favicon.png" />
      </v-avatar>

      <div v-else>
        <div class="d-flex align-center">
          <v-img
            src="/src/assets/Camada_1.png"
            alt="Logo"
            width="150"
            class="mb-3"
            contain
          ></v-img>
        </div>
        <div class="text-caption text-blue-lighten-3">Painel Admin</div>
      </div>
    </div>

    <v-divider
      class="mx-4 mb-4"
      color="blue-lighten-4"
      opacity="0.3"
    ></v-divider>

    <v-list nav class="px-2" v-model:opened="openGroups">
      <v-list-item
        v-for="item in menuItems"
        :key="item.value"
        :prepend-icon="item.icon"
        :title="item.title"
        :to="item.to"
        rounded="lg"
        class="mb-1 menu-item"
        :class="{ 'active-menu': $route.path === item.to }"
      >
      </v-list-item>

      <v-list-item
        v-if="showEventosMenu"
        v-for="item in eventosMenuItems"
        :key="item.value"
        :prepend-icon="item.icon"
        :title="item.title"
        :to="item.to"
        rounded="lg"
        class="mb-1 menu-item"
        :class="{ 'active-menu': $route.path === item.to }"
      >
      </v-list-item>

      <v-list-item
        v-if="showListaCertificadosMenu"
        v-for="item in listaCertificadosItems"
        :key="item.value"
        :prepend-icon="item.icon"
        :title="item.title"
        :to="item.to"
        rounded="lg"
        class="mb-1 menu-item"
        :class="{ 'active-menu': $route.path === item.to }"
      >
      </v-list-item>

      <v-list-item
        v-if="showBlogMenu"
        v-for="item in blogMenuItems"
        :key="item.value"
        :prepend-icon="item.icon"
        :title="item.title"
        :to="item.to"
        rounded="lg"
        class="mb-1 menu-item"
        :class="{ 'active-menu': $route.path === item.to }"
      >
      </v-list-item>

      <v-list-item
        v-if="showMarketplaceMenu"
        v-for="item in marketplaceMenuItems"
        :key="item.value"
        :prepend-icon="item.icon"
        :title="item.title"
        :to="item.to"
        rounded="lg"
        class="mb-1 menu-item"
        :class="{ 'active-menu': $route.path === item.to }"
      >
      </v-list-item>
      <v-list-group v-if="showAdminMenu" value="Admin">
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
            prepend-icon="mdi-shield-crown"
            title="Admin"
          ></v-list-item>
        </template>

        <v-list-item
          v-for="items in adminItemsList"
          :key="items.value"
          :prepend-icon="items.icon"
          :title="items.title"
          :value="items.value"
          :to="items.to"
          exact
        ></v-list-item>
      </v-list-group>
       <v-list-group v-if="showMarketingMenu" value="Marketing">
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
            prepend-icon="mdi-chart-donut-variant"
            title="Marketing"
          ></v-list-item>
        </template>

        <v-list-item
          v-for="items in marketingItemsList"
          :key="items.value"
          :prepend-icon="items.icon"
          :title="items.title"
          :value="items.value"
          :to="items.to"
          class="blue-icon"
          exact
        ></v-list-item>
      </v-list-group>

      <v-list-group v-if="showFinanceMenu" value="Financeiro">
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
            prepend-icon="mdi-bank"
            title="Financeiro"
          ></v-list-item>
        </template>

        <v-list-item
          v-for="items in financeItemsList"
          :key="items.value"
          :prepend-icon="items.icon"
          :title="items.title"
          :value="items.value"
          :to="items.to"
          exact
        ></v-list-item>
      </v-list-group>
    </v-list>

    <!-- Footer -->
    <template v-slot:append>
      <div>
        <v-divider
          class="mx-2 mb-3"
          color="blue-lighten-4"
          opacity="0.3"
        ></v-divider>

        <v-list nav>
          <v-list-item
            v-for="item in footerMenuItem"
            :key="item.value"
            :prepend-icon="item.icon"
            :title="item.title"
            :to="item.click ? undefined : item.to"
            @click="item.click ? item.click() : undefined"
            rounded="lg"
            class="mb-1 menu-item"
            :class="{ 'active-menu': $route.path === item.to }"
          >
          </v-list-item>
        </v-list>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { useLayoutStore } from '@/stores/layout'
import { useRoute } from 'vue-router'
import { ref, watch, computed } from 'vue'
import { getUserRole, SubRole, isSuperAdmin } from '@/utils/auth'

const layoutStore = useLayoutStore()
const $route = useRoute()
const openGroups = ref([])

const userRole = computed(() => getUserRole())
const isSuper = computed(() => isSuperAdmin())

const showAdminMenu = computed(() => userRole.value === SubRole.ADMIN)
const showMarketingMenu = computed(() =>
  userRole.value === SubRole.ADMIN || userRole.value === SubRole.MARKETING
)
const showFinanceMenu = computed(() => {
  if (!isSuper.value && userRole.value === SubRole.ADMIN) return false
  return userRole.value === SubRole.ADMIN || userRole.value === SubRole.FINANCEIRO
})
const showEventosMenu = computed(() =>
  userRole.value === SubRole.ADMIN || userRole.value === SubRole.ORGANIZADOR
)
const showListaCertificadosMenu = computed(() => userRole.value === SubRole.ADMIN)
const showBlogMenu = computed(() =>
  userRole.value === SubRole.ADMIN || userRole.value === SubRole.BLOG
)
const showMarketplaceMenu = computed(() =>
  userRole.value === SubRole.ADMIN || userRole.value === SubRole.MARKETPLACE
)

watch(() => layoutStore.rail, (isRail) => {
  if (isRail) {
    openGroups.value = []
  }
})

const menuItems = [
  {
    icon: 'mdi-view-dashboard',
    title: 'Dashboard',
    value: 'dashboard',
    to: '/',
  },
]

const marketplaceMenuItems = [
  {
    icon: 'mdi-shopping-outline',
    title: 'Marketplace',
    value: 'marketplace',
    to: '/marketplace',
  },
]

const blogMenuItems = [
  {
    icon: 'mdi-post-outline',
    title: 'Artigos',
    value: 'blog',
    to: '/artigos/',
  },
]

const eventosMenuItems = [
  {
    icon: 'mdi-calendar-multiple',
    title: 'Eventos',
    value: 'evento',
    to: '/evento',
  }
]

const listaCertificadosItems = computed(() => {
  if (isSuper.value) {
    return [
    {
     icon: 'mdi-certificate',
     title: 'Solicitações de Certificado',
     value: 'solicitacaoCertificado',
     to: '/solicitacaoCertificado',
   },
    ]
  } else {
    return []
  }
})

const adminItemsList = computed(() => {
  if (isSuper.value) {
    return [
      {
        icon: 'mdi-account-multiple',
        title: 'Usuários',
        value: 'usuarios',
        to: '/users',
      },
      {
        icon: 'mdi-account-multiple',
        title: 'Atletas',
        value: 'atletas',
        to: '/users/atletas',
      },
      {
        icon: 'mdi-account-multiple',
        title: 'Médicos',
        value: 'medicos',
        to: '/users/medicos/',
      },
      {
        icon: 'mdi-shield-account',
        title: 'Acessos',
        value: 'acessos',
        to: '/acessos',
      },
      {
        icon: 'mdi-dock-window',
        title: 'Portal',
        value: 'Portal',
        to: '/portal',
      },
    ]
  } else {
    return [
      {
        icon: 'mdi-shield-account',
        title: 'Acessos',
        value: 'acessos',
        to: '/acessos',
      },
    ]
  }
})
const financeItemsList = [
  {
    icon: 'mdi-bank-transfer',
    title: 'Solicitações',
    value: 'solicitacoes',
    to: '/solicitacoes',
  },
  {
    icon: 'mdi-ticket-percent',
    title: 'Cupons',
    value: 'cupons',
    to: '/cupom',
  },
  {
    icon: 'mdi-cash-multiple',
    title: 'Assinaturas',
    value: 'assinaturas',
    to: '/assinaturas',
  },

]
const marketingItemsList = [
  {
    icon: 'mdi-chart-bubble',
    title: 'Auditoria',
    value: 'auditoria',
    to: '/auditoria',
  },
  {
    icon: 'mdi-handshake-outline',
    title: 'Afiliados',
    value: 'afiliados',
    to: '/afiliados'
  },
  {
        icon: 'mdi-format-list-group',
        title: 'Cadastros não Finalizados',
        value: 'cadastroSimplificado',
        to: '/cadastrosNaoFinalizados',
      },
]

const footerMenuItem = [
  {
    icon: 'mdi-cog',
    title: 'Configurações',
    value: 'settings',
    to: '/configuracoes/',
  },
  {
    icon: 'mdi-logout',
    title: 'Sair',
    value: 'exit',
    click: () => {
      sessionStorage.removeItem('token')
      window.location.href = '/login'
    },
  },
]
</script>

<style scoped>
.clean-drawer {
  background: linear-gradient(135deg, #004064 0%, #009ece 100%) !important;
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.header-section {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  margin: 8px;
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.menu-item {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.15) !important;
  transform: translateX(8px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.active-menu {
  background: linear-gradient(45deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1)) !important;
  border-left: 4px solid #00C6FE;
  box-shadow: 0 4px 20px rgba(0, 198, 254, 0.3);
}



:deep(.v-list-group__items) {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  margin: 4px;
  backdrop-filter: blur(10px);
}

:deep(.v-list-item__prepend .v-icon) {
  color: rgba(255, 255, 255, 0.9);
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

:deep(.v-list-item-title) {
  color: rgba(255, 255, 255, 0.95) !important;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

:deep(.v-divider) {
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  height: 2px;
}

.text-blue-lighten-3 {
  color: rgba(255, 255, 255, 0.8) !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  font-weight: 600;
}

.clean-drawer :deep(.v-navigation-drawer__content) {
  overflow-y: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.clean-drawer :deep(.v-navigation-drawer__content)::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}
</style>
