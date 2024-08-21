import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('@/views/login/loginView.vue')
    },
    {
      path: '/admin',
      name: 'admin',
      component:() => import('@/views/admin/layout/AdminLayout.vue'),
      children:[
        {
          path: '/audit',
          name: 'audit',
          component: () => import('@/views/admin/audit/adminAudit.vue')
        },
        {
          path: '/books',
          name: 'books',
          component: () => import('@/views/admin/books/adminBooks.vue')
        },
        {
          path: '/cart',
          name: 'cart',
          component: () => import('@/views/admin/cart/adminCart.vue')
        },
        {
          path: '/category',
          name: 'category',
          component: () => import('@/views/admin/category/adminCategory.vue')
        },
        {
          path: '/information',
          name: 'information',
          component: () => import('@/views/admin/information/adminInformation.vue')
        },
      ]
    },
    {
      path: '/user',
      name: 'user',
      component: () => import('@/views/user/layout/userLayout.vue'),
      children:[
        {
          path: '/books',
          name: 'books',
          component: () => import('@/views/user/books/userBooks.vue')
        },
        {
          path: '/cart',
          name: 'cart',
          component: () => import('@/views/user/cart/userCart.vue')
        },
        {
          path: '/information',
          name: 'information',
          component: () => import('@/views/user/information/userInformation.vue')
        },
      ]
    },
  ]
})

export default router
