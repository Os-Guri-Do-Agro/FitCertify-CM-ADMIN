<template>
    <v-row no-gutters>
        <v-col class=" d-flex justify-space-between align-center">
            <div>
                <h1>Artigoss</h1>

            </div>
            <v-btn color="primary" variant="outlined" density="compact">Criar</v-btn>
        </v-col>

    </v-row>
    <v-card flat>
        <v-card-title class="d-flex align-center pe-2">

            Artigos

            <v-spacer></v-spacer>

            <v-text-field v-model="search" density="compact" label="Search" prepend-inner-icon="mdi-magnify"
                variant="solo-filled" flat hide-details single-line></v-text-field>
        </v-card-title>

        <v-divider></v-divider>
        <v-data-table v-model:search="search" :filter-keys="['titulo']" fixed-header hide-default-footer
            hide-default-header disable-sort :headers="headers" :items="sexo123">
            <template v-slot:item.foto="{ item }">
                <v-avatar size="36">
                    <img :src="item.foto" alt="foto artigo" />
                </v-avatar>
            </template>

            <!-- isMobile -->
            <template v-slot:item.isMobile="{ item }">
                <v-chip :color="item.isMobile ? 'green' : 'red'" size="small" label>
                    {{ item.isMobile ? 'Sim' : 'Não' }}
                </v-chip>
            </template>

            <!-- isDesktop -->
            <template v-slot:item.isDesktop="{ item }">
                <v-chip :color="item.isDesktop ? 'green' : 'red'" size="small" label>
                    {{ item.isDesktop ? 'Sim' : 'Não' }}
                </v-chip>
            </template>

            <!-- Ativo -->
            <template v-slot:item.ativo="{ item }">
                <v-chip :color="item.ativo ? 'green' : 'red'" size="small" label>
                    {{ item.ativo ? 'Ativo' : 'Inativo' }}
                </v-chip>
            </template>
        </v-data-table>
    </v-card>

    <h1>Artigos - Blog vão estar aqui</h1>
    <!-- {{ sexo123 }} -->
</template>

<script setup lang="ts">

import artigosService from '@/services/artigo/artigo-service';
import { onMounted, ref } from 'vue';
const search = ref('')
const artigos = ref()
const headers = [
    { title: 'Título', key: 'titulo' },
    { title: 'Subtítulo', key: 'subTitulo' },
    { title: 'Foto', key: 'foto' },
    { title: 'Mobile', key: 'isMobile' },
    { title: 'Desktop', key: 'isDesktop' },
    { title: 'Ativo', key: 'ativo' },
]

onMounted(async () => {
    const response = await artigosService.getArtigo();
    artigos.value = response

})

</script>
