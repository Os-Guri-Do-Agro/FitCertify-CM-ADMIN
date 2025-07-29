import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useLayoutStore = defineStore('layout', () => {
  // Recupera estado do localStorage ou usa padrões
  const drawer = ref(JSON.parse(localStorage.getItem('layout-drawer') ?? 'true'))
  const rail = ref(JSON.parse(localStorage.getItem('layout-rail') ?? 'false'))

  // Observa mudanças e salva no localStorage
  watch(drawer, (newValue) => {
    localStorage.setItem('layout-drawer', JSON.stringify(newValue))
  })

  watch(rail, (newValue) => {
    localStorage.setItem('layout-rail', JSON.stringify(newValue))
  })

  const toggleRail = () => {
    rail.value = !rail.value
  }

  const toggleDrawer = () => {
    drawer.value = !drawer.value
  }

  return {
    drawer,
    rail,
    toggleRail,
    toggleDrawer
  }
})
