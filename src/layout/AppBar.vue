<template>
    <v-app-bar color="" :elevation="0" class="app-bar">
        <template v-slot:prepend>
            <v-btn icon variant="text" @click="layoutStore.toggleRail()" class="ml-2">
                <v-icon>mdi-menu</v-icon>
            </v-btn>
        </template>

        <v-app-bar-title class="text-h6 font-weight-medium ">
            Dashboard
        </v-app-bar-title>

        <template v-slot:append>
            <v-btn icon variant="text" class="mr-2">
                <v-icon>mdi-bell-outline</v-icon>
            </v-btn>

            <v-menu>
                <template v-slot:activator="{ props }">
                    <v-btn icon variant="text" v-bind="props" class="mr-2">
                        <v-avatar size="32">
                            <v-img src="https://randomuser.me/api/portraits/men/85.jpg"></v-img>
                        </v-avatar>
                    </v-btn>
                </template>

            </v-menu>
        </template>
    </v-app-bar>
</template>

<script setup lang="ts">
import { useLayoutStore } from '@/stores/layout';

const layoutStore = useLayoutStore()
</script>

<style scoped>
.app-bar {
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}
</style>
