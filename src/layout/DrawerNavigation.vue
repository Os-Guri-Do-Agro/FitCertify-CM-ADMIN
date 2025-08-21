<template>
  <v-navigation-drawer
    v-model="layoutStore.drawer"
    :rail="layoutStore.rail"
    permanent
    @click="layoutStore.rail && layoutStore.toggleRail()"
    class="clean-drawer"
    color=""
    rail-width="65"
    style="
      position: fixed !important;
      height: 100vh !important;
      top: 0;
      left: 0;
    "
  >
    <!-- Header -->
    <div class="pa-4 text-center header-section">
      <v-avatar v-if="layoutStore.rail" size="36">
        <v-img src="/favicon.png" />
      </v-avatar>

      <div v-else>
        <!-- <v-avatar size="48" color="blue-lighten-1" class="mb-3">
                    <span class="text-white font-weight-bold text-h6">NG</span>
                </v-avatar> -->
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

    <!-- Menu -->
    <v-list nav class="px-2">
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

const layoutStore = useLayoutStore()
const $route = useRoute()

const menuItems = [
  {
    icon: 'mdi-view-dashboard',
    title: 'Dashboard',
    value: 'dashboard',
    to: '/',
  },
  {
    icon: 'mdi-post-outline',
    title: 'Artigos',
    value: 'blog',
    to: '/artigos/',
  },
  {
    icon: 'mdi-store',
    title: 'Marketplace',
    value: 'marketplace',
    to: '/marketplace',
  },
  {
    icon: 'mdi-calendar-multiple',
    title: 'Eventos',
    value: 'evento',
    to: '/evento',
  },
  { icon: 'mdi-domain', title: 'Empresa', value: 'empresa', to: '/empresa' },
  {
    icon: 'mdi-calendar-multiple',
    title: 'Organização',
    value: 'organizacao',
    to: '/organizacao',
  },
]
const footerMenuItem = [
  {
    icon: 'mdi-cog',
    title: 'Configurações',
    value: 'settings',
    to: '/settings',
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
