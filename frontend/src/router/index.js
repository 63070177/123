import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/firstPage',
    name: 'firstPage',
    component: () => import('../views/firstPage.vue') // set home as path '/'
  },
  {
    path: '/homePage/:userId',
    name: 'homePage',
    component: () => import('../views/HomePage.vue') // set home as path '/'
  },
  {
    path: '/book/:bookId/:userId',
    name: 'detailPage',
    component: () => import('../views/detailPage.vue')
  },
  {
    path: '/loginPage',
    name: 'loginPage',
    component: () => import('../views/loginPage.vue')
  },
  {
    path: '/signupPage',
    name: 'signupPage',
    component: () => import('../views/signupPage.vue')
  },
  {
    path: '/forgetPassword',
    name: 'forgetPassword',
    component: () => import('../views/forgetPassword.vue')
  },
  {
    path: '/detailProfile/:userId',
    name: 'detailProfile',
    component: () => import('../views/detailProfile.vue')
  },
  {
    path: '/barPage',
    name: 'barPage',
    component: () => import('../views/barPage.vue')
  },
  {
    path: '/addDetailBook/:userId',
    name: 'addDetailBook',
    component: () => import('../views/addDetailBook.vue')
  },
  {
    path: '/addAuthor/:userId',
    name: 'addAuthor',
    component: () => import('../views/addAuthor.vue')
  },
  {
    path: '/cart/:userId',
    name: 'memberOrder',
    component: () => import('../views/memberOrder.vue')
  },
  {
    path: '/billPage/:userId',
    name: 'billPage',
    component: () => import('../views/billPage.vue')
  },
  {
    path: '/thankPage/:userId',
    name: 'thankPage',
    component: () => import('../views/thankPage.vue')
  },
  {
    path: '/addPublisher/:userId',
    name: 'addPublisher',
    component: () => import('../views/addPublisher.vue')
  },
  {
    path: '/customerAddress/:userId',
    name: 'customerAddress',
    component: () => import('../views/customerAddress.vue')
  },
  {
    path: '/orderTable/:userId',
    name: 'orderTable',
    component: () => import('../views/orderTable.vue')
  },
  {
    path: '/editDetailBook/:userId/:bookId',
    name: 'editDetailBook',
    component: () => import('../views/editDetailBook.vue')
  },
  
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router