import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
const ElValidateTable = require('../lib/el-validate-table.umd.js')['default']
require('../lib/el-validate-table.css')
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.component('el-validate-table',ElValidateTable)

new Vue({
  render: h => h(App),
}).$mount('#app')
