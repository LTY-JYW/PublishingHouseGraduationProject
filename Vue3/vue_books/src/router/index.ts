import { createRouter, createWebHistory } from 'vue-router'
// 导入token
import { useUserStore } from '@/stores/user'
// 导入el组件
import { ElMessage } from 'element-plus'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/loginView.vue')
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/admin/layout/AdminLayout.vue'),
      children: [
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
        {
          path: 'user',
          name: 'adminUser',
          component: () => import('@/views/admin/user/adminUser.vue')
        },
        {
          path: 'info',
          name: 'adminInfo',
          component: () => import('@/views/admin/info/adminInfo.vue')
        },
        {
          path: 'pwd',
          name: 'adminPwd',
          component: () => import('@/views/admin/info/adminPwd.vue')
        },
        {
          path: 'avatar',
          name: 'adminAvatar',
          component: () => import('@/views/admin/info/adminAvatar.vue')
        },
      ]
    },
    {
      path: '/',
      name: 'user',
      component: () => import('@/views/user/layout/userLayout.vue'),
      children: [
        {
          path: '',
          name: 'userIndex',
          component: () => import('@/views/user/index/userIndex.vue')
        },
        {
          path: 'category',
          name: 'usercategory',
          component: () => import('@/views/user/category/categoryIndex.vue')
        },
        {
          path: 'books',
          name: 'userBooks',
          component: () => import('@/views/user/books/userBooks.vue')
        },
        {
          path: 'booksInfo',
          name: 'userBooksInfo',
          component: () => import('@/views/user/books/userBooksInfo.vue')
        },
        {
          path: 'author',
          name: 'userAuthor',
          component: () => import('@/views/user/author/authorIndex.vue')
        },
        {
          path: 'buyNow',
          name: 'buyNow',
          component: () => import('@/views/user/buyNow/buyNow.vue')
        },
        {
          path: 'information',
          name: 'userInformation',
          component: () => import('@/views/user/information/userInformation.vue')
        },
        {
          path: 'informationInfo',
          name: 'informationInfo',
          component: () => import('@/views/user/information/informationInfo.vue')
        },
        {
          path: 'search',
          name: 'search',
          component: () => import('@/views/user/search/searchIndex.vue')
        },
        {
          path: 'userInfoLayout',
          name: 'userInfoLayout',
          component: () => import('@/views/user/info/userInfo.vue'),
          children: [
            {
              path: 'userIndex',
              name: 'userIndex',
              component: () => import('@/views/user/info/userIndex.vue')
            },
            {
              path: 'userAuthor',
              name: 'userAuthor',
              component: () => import('@/views/user/info/applicationAuthor.vue')
            },
            {
              path: 'userOrder',
              name: 'userOrder',
              component: () => import('@/views/user/info/userOrder.vue')
            },
            {
              path: 'userOrderInfo',
              name: 'userOrderInfo',
              component: () => import('@/views/user/info/userOrderInfo.vue')
            },
            {
              path: 'cart',
              name: 'userCart',
              component: () => import('@/views/user/info/cart/userCart.vue')
            },
            {
              path: 'address',
              name: 'useraddress',
              component: () => import('@/views/user/info/address/userAddress.vue')
            },
          ]
        },
      ]
    },
  ]
})

//路由守卫
router.beforeEach((to) => {
  const userStore = useUserStore()
  //没有登录的用户只能访问登陆页面
  if (!userStore.token && to.path.includes('/admin')) {
    ElMessage.error('请先登录')
    return '/login'
  } else if (userStore.permissions === 2 && to.path.includes('/admin')) {
    console.log(userStore.permissions);
    ElMessage.error('用户禁止访问！')
    return '/'
  } else {
    return true
  }
})


export default router
