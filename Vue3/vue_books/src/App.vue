<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <Suspense>
    <RouterView />
  </Suspense>
</template>

<style scoped>
* {
  user-select: none;
}
</style>
