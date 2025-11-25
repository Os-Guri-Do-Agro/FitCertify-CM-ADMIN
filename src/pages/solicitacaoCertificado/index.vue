<template>
    <v-container fluid class="pa-6">
        <!-- Header Section -->
        <v-row class="mb-6">
            <v-col cols="12">
                <div class="d-flex flex-column flex-sm-row justify-space-between align-start align-sm-center ga-4">
                    <div class="header-content">
                        <h1 class="text-h3 font-weight-bold text-primary mb-2">
                            <v-icon icon="mdi-certificate" class="me-3" size="large"></v-icon>
                            Solicitações de Certificado
                        </h1>
                        <p class="text-subtitle-1 text-medium-emphasis mb-0">
                            Gerencie todas as solicitações de certificado
                        </p>
                    </div>
                </div>
            </v-col>
        </v-row>

        <!-- Stats Cards -->
        <v-row class="mb-6">
            <v-col cols="12" sm="6" md="3">
                <v-card class="stats-card" elevation="2">
                    <v-card-text class="pa-4">
                        <div class="d-flex align-center">
                            <v-avatar color="primary" class="me-3">
                                <v-icon icon="mdi-file-document" color="white"></v-icon>
                            </v-avatar>
                            <div>
                                <div class="text-h5 font-weight-bold">
                                    {{ totalItems || 0 }}
                                </div>
                                <div class="text-caption text-medium-emphasis">
                                    Total de Solicitações
                                </div>
                            </div>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <!-- Main Content Card -->
        <v-card class="main-card" elevation="3">
            <!-- Search Header -->
            <v-card-title class="pa-6 pb-4">
                <div class="d-flex flex-column flex-sm-row align-start align-sm-center ga-4 w-100">
                    <div class="d-flex align-center">
                        <v-icon icon="mdi-table" class="me-2" color="primary"></v-icon>
                        <span class="text-h6 font-weight-medium">Lista de Solicitações</span>
                    </div>
                    <v-spacer class="d-none d-sm-flex"></v-spacer>
                    <v-select v-model="situacaoFilter" :items="situacaoOptions" label="Filtrar por Situação"
                        variant="outlined" density="comfortable" hide-details style="max-width: 200px"
                        @update:model-value="handleFilterChange"></v-select>
                </div>
            </v-card-title>

            <v-divider></v-divider>

            <!-- Data Table -->
            <v-data-table :headers="headers" :items="solicitacoes" :loading="loading" :items-per-page="itemsPerPage"
                class="custom-table" hover hide-default-footer>
                <!-- Loading -->
                <template v-slot:loading>
                    <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
                </template>

                <!-- Situação -->
                <template v-slot:item.situacao="{ item }">
                    <v-chip :color="getSituacaoColor(item.situacao)" :prepend-icon="getSituacaoIcon(item.situacao)"
                        size="small" variant="flat">
                        {{ item.situacao || '' }}
                    </v-chip>
                </template>

                <!-- Nome do Evento -->
                <template v-slot:item.nomeEvento="{ item }">
                    {{ item.evento?.titulo || '' }}
                </template>

                <!-- Data/Hora de Envio -->
                <template v-slot:item.dataEnvio="{ item }">
                    {{ formatDate(item.dataCriacao || item.createdAt) }}
                </template>

                <!-- Actions -->
                <template v-slot:item.actions="{ item }">
                    <div class="d-flex ga-2">
                        <v-btn 
                            :disabled="item.situacao !== 'Pendente'"
                            color="primary" 
                            size="small" 
                            variant="outlined"
                            prepend-icon="mdi-check-circle"
                            @click="avaliarSolicitacao(item.id)"
                        >
                            Avaliar
                        </v-btn>
                    </div>
                </template>

                <!-- No data -->
                <template v-slot:no-data>
                    <div class="text-center pa-8">
                        <v-icon icon="mdi-certificate-outline" size="64" color="grey-lighten-1" class="mb-4"></v-icon>
                        <div class="text-h6 text-medium-emphasis mb-2">
                            Nenhuma solicitação encontrada
                        </div>
                        <div class="text-body-2 text-medium-emphasis">
                            Não há solicitações de certificado cadastradas
                        </div>
                    </div>
                </template>
            </v-data-table>

            <!-- Pagination -->
            <v-card-actions v-if="totalPages > 1" class="justify-end pa-4">
                <v-pagination v-model="currentPage" :length="totalPages" :total-visible="totalPages"
                    @update:model-value="handlePageChange"></v-pagination>
            </v-card-actions>
        </v-card>
    </v-container>
</template>

<script setup lang="ts">
import solicitacaoCertificadoService from '@/services/solicitacao-certificado/solicitacao-certificado-service'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import dayjs from 'dayjs'
import 'vue3-toastify/dist/index.css'

const router = useRouter()
const solicitacoes = ref<any[]>([])
const loading = ref(true)
const currentPage = ref(1)
const itemsPerPage = ref(10)
const totalItems = ref(0)
const totalPages = ref(0)
const situacaoFilter = ref('TODAS')

const situacaoOptions = [
    { title: 'Todas', value: 'TODAS' },
    { title: 'Pendente', value: 'Pendente' },
    { title: 'Valido', value: 'Valido' },
    { title: 'Invalido', value: 'Invalido' },
]

const headers = [
    { title: 'Nome do Evento', key: 'nomeEvento', sortable: true, align: 'start' as const },
    { title: 'Situação', key: 'situacao', sortable: true, align: 'start' as const },
    { title: 'Data/Hora de Envio', key: 'dataEnvio', sortable: true, align: 'start' as const },
    { title: 'Ações', key: 'actions', sortable: false, width: '150px', align: 'start' as const },
]

const getSituacaoColor = (situacao: string) => {
    switch (situacao?.toUpperCase()) {
        case 'PENDENTE':
            return 'warning'
        case 'VALIDO':
            return 'success'
        case 'INVALIDO':
            return 'error'
        default:
            return 'grey'
    }
}

const getSituacaoIcon = (situacao: string) => {
    switch (situacao?.toUpperCase()) {
        case 'PENDENTE':
            return 'mdi-clock-outline'
        case 'VALIDO':
            return 'mdi-check-circle'
        case 'INVALIDO':
            return 'mdi-close-circle'
        default:
            return 'mdi-help-circle'
    }
}

const formatDate = (date: string) => {
    if (!date) return ''
    return dayjs(date).format('DD/MM/YYYY HH:mm')
}

const avaliarSolicitacao = (id: string) => {
    router.push({ path: '/solicitacaoCertificado/avaliar', query: { id } })
}

const loadSolicitacoes = async () => {
    loading.value = true
    try {
        const situacao = situacaoFilter.value === 'TODAS' ? '' : situacaoFilter.value
        const response = await solicitacaoCertificadoService.findAllPaginatedSolicitacoesCertificados(
            currentPage.value,
            itemsPerPage.value,
            situacao
        )

        solicitacoes.value = Array.isArray(response.data?.itens) ? response.data.itens : []
        totalItems.value = response.data?.total || 0
        totalPages.value = response.data?.totalPages || 0
    } catch (error) {
        console.error('Erro ao carregar solicitações:', error)
        toast.error('Erro ao carregar solicitações de certificado')
    } finally {
        loading.value = false
    }
}

const handlePageChange = (page: number) => {
    currentPage.value = page
    loadSolicitacoes()
}

const handleFilterChange = () => {
    currentPage.value = 1
    loadSolicitacoes()
}

onMounted(async () => {
    await loadSolicitacoes()
})
</script>

<style scoped>
.header-content {
    flex: 1;
}

.stats-card {
    transition: all 0.3s ease;
    border-radius: 12px;
}

.stats-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.main-card {
    border-radius: 16px;
    overflow: hidden;
}

.search-field {
    transition: all 0.3s ease;
}

.custom-table {
    border-radius: 0;
}

.custom-table :deep(.v-data-table__tr:hover) {
    background-color: rgba(var(--v-theme-primary), 0.05);
}

.custom-table :deep(.v-data-table__td) {
    padding-left: 16px !important;
}

.custom-table :deep(.v-data-table__th) {
    padding-left: 16px !important;
}

@media (max-width: 600px) {
    .header-content h1 {
        font-size: 1.75rem !important;
    }

    .stats-card {
        margin-bottom: 1rem;
    }
}
</style>
