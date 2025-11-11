/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router/auto'
import { routes } from 'vue-router/auto-routes'
import {  isTokenValid, getSubRole } from '@/utils/auth'
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

  // Verificação de permissões por role
  if (isAuthenticated) {
    const userRole = getSubRole();
    const path = to.path;

    // Rotas que só admin pode acessar
    const adminOnlyRoutes = ['/users', '/users/atletas', '/users/medicos', '/portal'];
    
    // Rotas específicas por role
    const roleRoutes = {
      marketing: ['/auditoria'],
      financeiro: ['/cupom', '/assinaturas'],
      organizador: ['/evento', '/organizacao'],
      blog: ['/artigos'],
      marketplace: ['/marketplace', '/empresa']
    };

    // Verifica se é rota admin-only
    if (adminOnlyRoutes.some(route => path.startsWith(route)) && userRole !== 'admin') {
      toast.error('Acesso negado. Você não tem permissão para acessar esta página.');
      return next('/');
    }

    // Verifica rotas específicas por role (não-admin)
    if (userRole !== 'admin') {
      const allowedRoutes = roleRoutes[userRole as keyof typeof roleRoutes] || [];
      const isRoleSpecificRoute = Object.values(roleRoutes).flat().some(route => path.startsWith(route));
      
      if (isRoleSpecificRoute && !allowedRoutes.some(route => path.startsWith(route))) {
        toast.error('Acesso negado. Você não tem permissão para acessar esta página.');
        return next('/');
      }
    }
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
