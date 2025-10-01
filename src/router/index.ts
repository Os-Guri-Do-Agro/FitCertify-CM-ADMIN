/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router/auto'
import { routes } from 'vue-router/auto-routes'
import { checkAuthAndRedirect, isTokenValid } from '@/utils/auth'
import { toast } from 'vue3-toastify';


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Guard de autenticação
router.beforeEach((to, from, next) => {
  const publicRoutes = ['/login', '/esqueceuSenha', '/politicaPrivacidade', '/portal'];
  const isAuthenticated = isTokenValid();

  // Impede usuários logados de acessar login, register e registerPlanos
  if (isAuthenticated && (to.path === '/login' )) {
    return next('/');
  }

  if (publicRoutes.includes(to.path)) {
    return next();
  }

  if (!isAuthenticated) {
    sessionStorage.clear();
    if (to.path.includes("/esqueceuSenha")) {
      return next()
    }

    if (to.path !== '/login') {
      router.push('/login').then(() => {
        toast.error("Usuário não autenticado, redirecionando para login", { autoClose: 3000 });
      })
    }
    return next();
  }
  next();
});

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
