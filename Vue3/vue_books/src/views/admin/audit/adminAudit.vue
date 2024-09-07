<script lang="ts" setup>
import { ref } from 'vue'
import {auditGetOveryApi} from '@/api/audit'
import { URL } from '@/utils/defaultAvatar'

import type { AuditOveryType } from '@/api/audit'
const page = ref(1)
const itemsPerPage = ref(2)
const tableDate = ref<AuditOveryType>()


  const a = await auditGetOveryApi(page.value,itemsPerPage.value)
  tableDate.value = a.data.data

</script>

<template>

  <pageComponent title="审核员管理">
    <template #button>
      <el-button
        plain
        type="primary"
        round
   
        >添加审核员</el-button
      >
    </template>
    <el-table stripe style="width: 100%" :data="tableDate">
      <el-table-column label="头像" width="180">
      <template #default="scope">
        <div style="display: flex; align-items: center">
          <el-avatar
        :src='scope.row.date'
        v-if="scope.row.date"
        />
        <el-avatar
        :src='URL'
        v-else
        />
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="nickname" label="昵称" />
    <el-table-column prop="username" label="账号" width="180" />
  </el-table>
  </pageComponent>

</template>  

<style scoped>
</style>