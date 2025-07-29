<template>
    <v-navigation-drawer v-model="layoutStore.drawer" :rail="layoutStore.rail" permanent
        @click="layoutStore.rail && layoutStore.toggleRail()" class="clean-drawer" color="#1e3a8a" rail-width="65">
        <!-- Header -->
        <div class="pa-4 text-center header-section">
            <v-avatar v-if="layoutStore.rail" size="36" color="blue-lighten-1">
                <span class="text-white font-weight-bold text-body-1">NG</span>
            </v-avatar>

            <div v-else>
                <v-avatar size="48" color="blue-lighten-1" class="mb-3">
                    <span class="text-white font-weight-bold text-h6">NG</span>
                </v-avatar>
                <div class="text-h6 text-white font-weight-medium mb-1">NG</div>
                <div class="text-caption text-blue-lighten-3">Admin Panel</div>
            </div>
        </div>

        <v-divider class="mx-4 mb-4" color="blue-lighten-4" opacity="0.3"></v-divider>

        <!-- Menu -->
        <v-list nav class="px-2">
            <v-list-item v-for="item in menuItems" :key="item.value" :prepend-icon="item.icon" :title="item.title"
                :to="item.to" rounded="lg" class="mb-1 menu-item" :class="{ 'active-menu': $route.path === item.to }">
            </v-list-item>
        </v-list>

        <!-- Footer -->
        <template v-slot:append>
            <div class="pa-2">
                <v-divider class="mx-2 mb-3" color="blue-lighten-4" opacity="0.3"></v-divider>

                <v-list nav>
                    <v-list-item prepend-icon="mdi-cog" title="Configurações" rounded="lg"
                        class="mb-1 mx-2 footer-item">
                    </v-list-item>

                    <v-list-item prepend-icon="mdi-logout" title="Sair" rounded="lg" class="mx-2 logout-item">
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
    { icon: 'mdi-view-dashboard', title: 'Dashboard', value: 'dashboard', to: '/' },
    { icon: 'mdi-post-outline', title: 'Blog', value: 'blog', to: '/blog' },
    { icon: 'mdi-store', title: 'Marketplace', value: 'marketplace', to: '/marketplace' },
    { icon: 'mdi-account-group-outline', title: 'Usuários', value: 'users', to: '/users' },
    { icon: 'mdi-triangle-outline', title: 'Teste', value: 'teste', to: '/teste' },
]
</script>
