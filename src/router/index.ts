import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Signup from '../views/Signup.vue'
import ColumnDetail from '../views/ColumnDetail.vue'
import CreatePost from '../views/CreatePost.vue'
import PostDetail from '../views/PostDetail.vue'
import NotFound from '../views/NotFound.vue'
import store from '../store'
import { axios } from '../libs/http'

const routerHistory = createWebHistory()
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { redirectAlreadyLogin: true }
  },
  {
    path: '/signup',
    name: 'signup',
    component: Signup,
    meta: { redirectAlreadyLogin: true }
  },
  {
    path: '/column/:id',
    name: 'column',
    component: ColumnDetail
  },
  {
    path: '/create',
    name: 'create',
    component: CreatePost,
    meta: { requiredLogin: true }
  },
  {
    path: '/posts/:id',
    name: 'post',
    component: PostDetail
  },
  {
    path: '/*',
    name: 'notFound',
    components: NotFound
  }
]

const router = createRouter({
  history: routerHistory,
  routes
})

// 路由前置守卫
router.beforeEach((to, from, next) => {
  const { user, token } = store.state
  const { requiredLogin, redirectAlreadyLogin } = to.meta
  if (!user.isLogin) {
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
      store.dispatch('fetchCurrentUser').then(() => {
        redirectAlreadyLogin ? next('/') : next()
      }).catch(err => {
        console.error('[err]', err)
        store.commit('logout')
        next('login')
      })
    } else {
      requiredLogin ? next('login') : next()
    }
  } else {
    requiredLogin ? next('/') : next()
  }
})

export default router
