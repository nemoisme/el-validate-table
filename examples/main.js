import vue from "vue";
import vueRouer from "vue-router";
import App from "./App.vue";
import ELVlidateTable from "el-validate-table";
const routes = [
  {
    path: "/demos/demo1",
    component: () => import("./demos/demo1")
  }
  // {
  //   path: "/demos/demo2",
  //   component: () => import("./demos/demo2")
  // }
];

const router = new vueRouer({
  mode: "hash",
  routes
});

Vue.component("el-validate-table", ELVlidateTable);

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
