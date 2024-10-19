<script setup lang="ts">
import { toRefs, defineProps } from 'vue'
const prop = defineProps({
  title: String
})
const { title } = toRefs(prop)
</script>
<template>
  <el-card class="page">
    <template #header>
      <div class="head">
        <div class="head-left">
          <span>{{ title }}</span>
        </div>
        <div class="head-reight">
          <slot name="button"></slot>
        </div>
      </div>
    </template>
    <slot></slot>
  </el-card>
</template>

<style scoped>
.page {
  min-height: 100%;
  box-sizing: border-box;
}

.head {
  display: flex;
  padding: 3px;
  justify-content: space-between;
  align-items: center;
}
</style>
