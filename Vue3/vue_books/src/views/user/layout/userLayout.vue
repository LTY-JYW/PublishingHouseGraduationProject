<script lang="ts" setup>
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()
const a = userStore.token
console.log(a);

</script>
<template>
  <div>
    这是前台结构页面
  </div>
</template>
    
<style scoped></style>