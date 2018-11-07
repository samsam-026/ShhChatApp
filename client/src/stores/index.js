import Vue from "vue";
import Vuex from "vuex";

import { UserStore } from "./UserStore";

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    UserStore
  }
});
