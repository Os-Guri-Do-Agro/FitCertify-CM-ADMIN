/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router/auto'
import { routes } from 'vue-router/auto-routes'
import { checkAuthAndRedirect } from '@/utils/auth'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Guard de autenticação
router.beforeEach((to) => {
  console.log('Navegando para:', to.path)

  // Rotas públicas que não precisam de autenticação
  const publicRoutes = ['/login', '/opaksdopkasopkdopaskd', '/politicaPrivacidade']

  if (publicRoutes.includes(to.path)) {
    console.log('Rota pública, permitindo acesso')
    return true
  }

  // Verificar se está autenticado para outras rotas
  const result = checkAuthAndRedirect()
  console.log('Resultado da verificação:', result)
  return result
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (localStorage.getItem('vuetify:dynamic-reload')) {
      console.error('Dynamic import error, reloading page did not fix it', err)
    } else {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
