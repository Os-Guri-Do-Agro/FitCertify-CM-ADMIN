<template>
    <v-container fluid class="pa-6">
        <v-row class="mb-8">
      <v-col cols="12">
        <v-card class="pa-6 gradient-header" elevation="2">
          <div class="d-flex flex-column flex-sm-row align-start align-sm-center justify-space-between w-100">
            <div>
              <h1 class="text-h4 font-weight-bold text-white mb-2 d-flex align-center">
                <v-icon icon="mdi-cash-multiple" class="me-3 text-white" size="32"></v-icon>
                Assinaturas
              </h1>
              <p class="text-body-1 text-white opacity-80 mb-0">
                Monitoramento de assinaturas
              </p>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <v-card class="pa-4" elevation="2">
          <h3 class="mb-4">Distribuição por Planos</h3>
          <div id="planos-chart" style="width: 100%; height: 400px;"></div>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="pa-4" elevation="2">
          <h3 class="mb-4">Status das Assinaturas</h3>
          <div id="status-chart" style="width: 100%; height: 400px;"></div>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col cols="12" md="6">
        <v-card class="pa-4" elevation="2">
          <h3 class="mb-4">Assinaturas por Dia</h3>
          <div id="timeline-chart" style="width: 100%; height: 400px;"></div>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="pa-4" elevation="2">
          <h3 class="mb-4">Métodos de Pagamento</h3>
          <div id="payment-chart" style="width: 100%; height: 400px;"></div>
        </v-card>
      </v-col>
    </v-row>
    </v-container>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts'
import AssinaturaService from '@/services/pagarMe/assinaturas'

 const assinaturas = ref([])


 const buscarAssinaturas = async () => {
     try {
        const response = await AssinaturaService.getPlansSubscriptions();
         assinaturas.value = response.data
         return response.data
     } catch (error) {
        console.error('Erro ao buscar assinaturas:', error)
        return null
     }
 }

onMounted(async () => {
  const metrica = await buscarAssinaturas()
  if (!metrica) return

  const planosChart = echarts.init(document.getElementById('planos-chart'))
  const contadorPlanos = metrica.reduce((acc, item) => {
    const nome = item.plan?.name || 'Sem nome'
    acc[nome] = (acc[nome] || 0) + 1
    return acc
  }, {})
  
  const dadosPlanos = Object.entries(contadorPlanos).map(([nome, valor]) => ({ value: valor, name: nome }))
  
  planosChart.setOption({
    tooltip: { trigger: 'item' },
    legend: { top: '5%', left: 'center' },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      data: dadosPlanos,
      itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 }
    }]
  })

  const statusChart = echarts.init(document.getElementById('status-chart'))
  const contadorStatus = metrica.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1
    return acc
  }, {})
  
  const dadosStatus = Object.entries(contadorStatus).map(([nome, valor]) => ({ value: valor, name: nome }))
  
  statusChart.setOption({
    tooltip: { trigger: 'item' },
    series: [{
      type: 'pie',
      radius: '60%',
      data: dadosStatus,
      itemStyle: { borderRadius: 5 }
    }]
  })

  const timelineChart = echarts.init(document.getElementById('timeline-chart'))
  const assinaturasPorDia = metrica.reduce((acc, item) => {
    const data = new Date(item.created_at).toLocaleDateString('pt-BR')
    acc[data] = (acc[data] || 0) + 1
    return acc
  }, {})
  
  const datasOrdenadas = Object.keys(assinaturasPorDia).sort((a, b) => new Date(a.split('/').reverse().join('-')) - new Date(b.split('/').reverse().join('-')))
  
  timelineChart.setOption({
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: datasOrdenadas },
    yAxis: { type: 'value' },
    series: [{
      type: 'line',
      data: datasOrdenadas.map(data => assinaturasPorDia[data]),
      smooth: true,
      itemStyle: { color: '#1976d2' }
    }]
  })

  const paymentChart = echarts.init(document.getElementById('payment-chart'))
  const contadorPagamento = metrica.reduce((acc, item) => {
    acc[item.payment_method] = (acc[item.payment_method] || 0) + 1
    return acc
  }, {})
  
  const dadosPagamento = Object.entries(contadorPagamento).map(([nome, valor]) => ({ value: valor, name: nome }))
  
  paymentChart.setOption({
    tooltip: { trigger: 'item' },
    series: [{
      type: 'pie',
      radius: '60%',
      data: dadosPagamento
    }]
  })
})
</script>

<style scoped>
.gradient-header {
  background: linear-gradient(135deg, #1976d2, #42a5f5);
  border-radius: 16px;
}
</style>