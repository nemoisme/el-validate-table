import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'

import ElValidateTable from '../src/lib/el-validate-table/index.vue'
import Demo1 from './../stories/demo1.vue'

Vue.component('el-validate-table',ElValidateTable)

const routes = new VueRouter({
  mode: 'hash',
  routes:[
    {
      path:'/demo1',
      component:Demo1
    }
  ]
})

new Vue({
  el: '#app',
  routes,
  render: h => h(App)
})
