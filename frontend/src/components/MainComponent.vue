<template>
  <main id="main-component">
      <div v-if="attemptedLogin">
          <div v-if="!$store.getters.loggedIn" class="partner-app--loginPanel">
            <h1>Welcome!</h1>
            <span class="partner-app--button" @click="login()">LOG IN</span>
          </div>
          <div v-else id="main-flex">
            <left-bar></left-bar>
            <div class="canvas-container" id="canvas"></div>
          </div>
      </div>
      <div v-else>
          <img src="/src/resources/loading.gif" class="center">
      </div>
  </main>
</template>

<script>
import LeftBar from './LeftBar';
import Vue from 'vue';

export default {
  name: 'MainComponent',
  components: {
    LeftBar,
  },
  data() {
    return {
      attemptedLogin: false
    };
  },
  mounted () {
    this.$store.dispatch('userInfo')
        .then(() => {
            console.log(this.$store.getters.loggedIn);
            this.attemptedLogin = true;
            if (this.$store.getters.loggedIn) {
              Vue.nextTick(() => this.$store.commit('CREATE_CANVAS', document.getElementById('canvas')));
            }
        }, () => {
            this.attemptedLogin = true;
            console.error('Either something went wrong or the user is not logged in.');
        })
  },
  methods: {
    login () {
        this.$store.dispatch('login');
    },
  }
};
</script>
