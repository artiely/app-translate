import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/local',
      name: 'Hello',
      component: HelloWorld
    },
    {
      path: '/',
      name: 'login',
      component: Login
    }
  ]
})
