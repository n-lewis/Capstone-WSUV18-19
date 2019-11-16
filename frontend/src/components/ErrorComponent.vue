<template>
  <div>
    <h1>ERROR</h1>
    <h3>{{ $store.getters.error }}</h3>
    <p>{{ $store.getters.errorMessage }}</p>
  </div>
</template>

<script>
export default {
  name: "ErrorComponent"
};
</script>
