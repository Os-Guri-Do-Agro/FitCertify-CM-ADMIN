<template>
  <v-container fluid class="pa-6">
    <v-row>
      <v-col cols="6" class="text-start">
        <div class="header-content">
          <h1 class="text-h3 font-weight-bold text-primary mb-2">
            <v-icon
              icon="mdi-newspaper-variant"
              class="me-3"
              size="large"
            ></v-icon>
            Criar Organização
          </h1>
        </div>
      </v-col>
      <v-col cols="6" class="text-end">
        <router-link :to="{ path: '/organizacao/' }">
          <v-btn
            color="primary"
            size="large"
            prepend-icon="mdi-arrow-left"
            class="create-btn"
            elevation="2"
          >
            Voltar
          </v-btn>
        </router-link>
      </v-col>
    </v-row>
    <FormOrganizacao />
  </v-container>
</template>

<script setup lang="ts"></script>
