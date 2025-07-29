<template>
  <v-app>
    <!-- Layout com Drawer e AppBar -->
    <v-layout v-if="!isAuthRoute">
      <DrawerNavigation />
      <AppBar />
      <v-main class="main-content">
        <v-container fluid class="pa-4">
          <router-view />
        </v-container>
      </v-main>
    </v-layout>

    <!-- Layout sem Drawer/AppBar (Login, etc) -->
    <v-main v-else class="auth-layout">
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppBar from './layout/AppBar.vue'
import DrawerNavigation from './layout/DrawerNavigation.vue'

const route = useRoute()

// Rotas que não devem mostrar o layout padrão
const authRoutes = ['/login', '/register', '/forgot-password']

const isAuthRoute = computed(() => {
  return authRoutes.includes(route.path)
})
</script>

<style>
.main-content {
  background-color: #f8fafc;
  min-height: 100vh;
}

.auth-layout {
  background: url(assets/image-test.png);
  min-height: 100vh;
  background-repeat: no-repeat;
}
</style>
