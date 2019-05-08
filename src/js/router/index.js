import Vue from 'vue'
import Router from 'vue-router'
import Index from 'components/Index'
import Todo from 'components/Todo'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index
    },
    {
      path: '/todo',
      name: 'todo',
      component: Todo
    }
  ]
})