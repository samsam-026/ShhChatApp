import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Vuex from "vuex";
import { store } from "./stores";

Vue.use(Vuex);

Vue.config.productionTip = false;

//Vue.http.headers.common["Access-Control-Allow-Origin"] = "*";

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
