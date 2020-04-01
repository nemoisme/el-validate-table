import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import ElValidateTable from './../lib/el-validate-table'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
Vue.component('el-validate-table',ElValidateTable)
new Vue({
  render: h => h(App),
}).$mount('#app')