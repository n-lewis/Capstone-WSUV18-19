<template>
  <div id="app">
    <error-component v-if="$store.getters.error"></error-component>
    <main-component v-else/>
  </div>
</template>

<script>
import MainComponent from './components/MainComponent';
import ErrorComponent from './components/ErrorComponent';

export default {
  name: 'App',
  components: {
    MainComponent,
    ErrorComponent,
  },
};
</script>
