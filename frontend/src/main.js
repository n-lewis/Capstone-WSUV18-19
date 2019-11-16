// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import Vuex from 'vuex'
import VueRouter from 'vue-router'

Vue.use(Vuex);
Vue.use(VueRouter);

import { router } from './router/router';
import { store } from './store/store';

Vue.config.productionTip = false;

/* eslint-disable no-new */
var vm1 = new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App),
});
