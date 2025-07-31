<template>
    <!-- <v-row  no-gutters>
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
            <template v-slot:header.stock>
                <div class="text-end">Stock</div>
            </template>



            <!-- <template v-slot:item.stock="{ item }">
            <div class="text-end">
              <v-chip
                :color="item.is ? 'green' : 'red'"
                :text="item.stock ? 'In stock' : 'Out of stock'"
                class="text-uppercase"
                size="small"
                label
              ></v-chip>
            </div>
          </template> -->
        <!-- </v-data-table> -->
    <!-- </v-card> --> 

    <h1>Artigos - Blog vão estar aqui</h1>
    <!-- {{ sexo123 }} -->
</template>

<script setup lang="ts">

import artigosService from '@/services/artigo/artigo-service';
import { onMounted, ref } from 'vue';
const search = ref('')
const sexo123 = ref()
const headers = [
    { title: 'Título', key: 'titulo' },
    { title: 'Subtítulo', key: 'subTitulo' },

]

onMounted(async () => {
    const response = await artigosService.getArtigo();
    sexo123.value = response

})

</script>



foto: string
ativo: boolean
isMobile: boolean
isDesktop: boolean
createdAt: Date
updatedAt: Date
categoriaArtigoId: string | null