import { createRouter, createWebHistory } from 'vue-router'
// 导入token
import { useUserStore } from '@/stores/user'
// 导入el组件
import { ElMessage } from 'element-plus'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('@/views/login/loginView.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue')
    },
    {
      path: '/admin',
      name: 'admin',
      component:() => import('@/views/admin/layout/AdminLayout.vue'),
      children:[
        {
          path: 'audit',
          name: 'audit',
          component: () => import('@/views/admin/audit/adminAudit.vue')
        },
        {
          path: 'books',
          name: 'books',
          component: () => import('@/views/admin/books/adminBooks.vue')
        },
        {
          path: 'cart',
          name: 'cart',
          component: () => import('@/views/admin/cart/adminCart.vue')
        },
        {
          path: 'category',
          name: 'category',
          component: () => import('@/views/admin/category/adminCategory.vue')
        },
        {
          path: 'category2',
          name: 'category2',
          component: () => import('@/views/admin/category/adminCategoryTwo.vue')
        },
        {
          path: 'information',
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
          path: 'books',
          name: 'userBooks',
          component: () => import('@/views/user/books/userBooks.vue')
        },
        {
          path: 'cart',
          name: 'userCart',
          component: () => import('@/views/user/cart/userCart.vue')
        },
        {
          path: 'information',
          name: 'userInformation',
          component: () => import('@/views/user/information/userInformation.vue')
        },
      ]
    },
  ]
})

//路由守卫
router.beforeEach((to) => {
  const userStore = useUserStore()
  //没有登录的用户只能访问登陆页面
  if (!userStore.token && to.path != '/') {
    ElMessage.error('请先登录')
    return '/'
  } else {
    return true
  }
})


export default router
