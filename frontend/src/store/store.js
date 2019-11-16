import Vue from 'vue';
import Vuex from 'vuex';
import { getQueryParam, postData } from '../helpers/index';
import Canvas from '../threejs/canvas';

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    error: getQueryParam('error'),
    errorMessage: getQueryParam('errorDescription'),
    loggedIn: false,
    myNum: 4,
    firstName: '',
    lastName: '',
    canvas: null,
    imgGroup: [],
    currentDrawnObject: null,
  },
  mutations: {
    SET_USER_INFO(state, response) {
      // Sets loggedIn and user data
      state.loggedIn = true;
      state.firstName = response.user.firstName;
      state.lastName = response.user.lastName;
    },
    CREATE_CANVAS(state, canvasContainer) {
      state.canvas = new Canvas(canvasContainer);
    },
    SET_CURRENT_DRAWN_OBJECT(state, currentDrawnObject) {
      state.currentDrawnObject = currentDrawnObject;
    },
    LOGIN(state, response) {
      // Login loads a new window -- this is unneeded?
    },
    LOGOUT(state, response) {
      // Logout reloads the window -- this is unneeded?
    },
  },
  getters: {
    error: state => state.error,
    errorMessage: state => state.errorMessage,
    loggedIn: state => state.loggedIn,
    displayName: state => ((state.firstName) ? `${state.firstName} ${state.lastName}` : 'User'),
    canvas: state => state.canvas,
    currentDrawnObject: state => state.currentDrawnObject,
  },
  actions: {
    userInfo({ commit }) {
      return new Promise((resolve, reject) => {
        fetch('/api/session/user')
          .then(res => res.json())
          .then((response) => {
            console.log(response); // for debugging -- delet this.
            commit('SET_USER_INFO', response);
            resolve();
          })
          .catch(((error) => {
            // Not really an error,
            // The API returns 401 null, which causes a failure
            console.error(`While fetching session/user: ${error}`);
            reject();
          }));
      });
    },
    login({ commit }) {
      postData('/api/hpid/link', {
        operation: 'login',
        redirectUrl: window.location.href,
        forceLogin: false })
        .then((response) => {
          console.log(`Redirect URL: ${response.loginLink}`);
          window.location.replace(response.loginLink);
        })
        .catch(err => console.error(err));
    },
    logout({ commit }) {
      postData('/api/hpid/link', {
        operation: 'logout',
        redirectUrl: window.location.href,
        forceLogin: false })
        .then((response) => {
          console.log(`Redirect URL: ${response.loginLink}`);
          window.location.replace(response.loginLink);
        })
        .catch(err => console.error(err));
    },
  },

});
