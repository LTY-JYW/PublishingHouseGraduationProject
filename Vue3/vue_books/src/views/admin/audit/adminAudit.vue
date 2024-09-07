<script lang="ts" setup>
import { ref } from 'vue'
import { auditGetOveryApi } from '@/api/audit'
import { URL } from '@/utils/defaultAvatar'

import type { AuditOveryType } from '@/api/audit'
const page = ref(1)
const itemsPerPage = ref(2)
const tableDate = ref<AuditOveryType>()


const a = await auditGetOveryApi(page.value, itemsPerPage.value)
tableDate.value = a.data.data

const total:number = tableDate.value.length

// 改变页码是的函数 
const onChange = async (currentPage: number, pageSize: number) => {
  // if (params.value.pagesize === size) {
  //   params.value.pagenum = page
  //   await getList()
  // } else {
  //   params.value.pagenum = 1
  //   params.value.pagesize = size
  //   await getList()
  // }
  console.log(currentPage);
  console.log(pageSize);
  
  
}

</script>

<template>
  <pageComponent title="审核员管理">
    <template #button>
      <el-button plain type="primary" round>添加审核员</el-button>
    </template>
    <el-table stripe style="width: 100%" :data="tableDate">
      <el-table-column label="头像" width="180">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <el-avatar :src='scope.row.date' v-if="scope.row.date" />
            <el-avatar :src='URL' v-else />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="nickname" label="昵称" />
      <el-table-column prop="username" label="账号" width="180" />
    </el-table>
    <!-- 分页部分 -->
    <div class="pagination">
      <el-pagination
        v-model:current-page="page"
        v-model:page-size="itemsPerPage"
        :page-sizes="[1, 5, 10, 15]"
        :background="true"
        layout="jumper, total, sizes, prev, pager, next"
        :total="total"
        @change="onChange"
      />
    </div>
  </pageComponent>
</template>  

<style scoped></style>