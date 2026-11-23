import { defineRouter } from '#q-app/wrappers'
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  { path: '/login', component: () => import('../pages/LoginPage.vue'), meta: { guestOnly: true } },
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', component: () => import('../pages/ShopPage.vue') },
      { path: 'cart', component: () => import('../pages/CartPage.vue') },
      { path: 'manage', component: () => import('../pages/ManagePlantsPage.vue'), meta: { requiresAdmin: true } }
    ]
  },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

export default defineRouter(() => {
  const router = createRouter({ history: createWebHistory(), routes, scrollBehavior: () => ({ left: 0, top: 0 }) })

  // Route Guards
  router.beforeEach((to) => {
    const auth = useAuthStore()
    if (to.matched.some((r) => r.meta.requiresAuth) && !auth.isLoggedIn) {
      return { path: '/login', query: { redirect: to.fullPath } }
    }
    if (to.matched.some((r) => r.meta.requiresAdmin) && !auth.isAdmin) return '/'
    if (to.meta.guestOnly && auth.isLoggedIn) return '/'
  })
  return router
})
