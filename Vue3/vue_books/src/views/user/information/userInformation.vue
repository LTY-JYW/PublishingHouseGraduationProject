<script lang="ts" setup>
import { ref } from 'vue'
// 导入API
import { informationApprovedGetListAPI } from '@/api/information'
// 导入API类型
import type { InformationType } from '@/api/information'
import type { PageByType } from '@/api/results'
// 导入公共函数
import { formDate } from '@/utils/dayjs'
// 导入el图标
import { Search } from '@element-plus/icons-vue'
// 导入路由
import router from '@/router'
// 导入路由
import { useRoute } from 'vue-router'

const route = useRoute()
// 图书Id
const id: number = Number(route.query.id)

// 搜索变量
const search = ref('')
// 搜索框取消图标触发函数
const onClear = async () => {
  search.value = ''
}

// 分页变量
const page = ref<PageByType>({
  page: 1,
  itemsPerPage: 10,
  by: 'time',
  des: 'desc'
})
// 数据总数变量
const total = ref<number>()
// 资讯列表变量
const informationList = ref<InformationType>()
// 获取资讯列表函数
const getList = async () => {
  const { data: { data } } = await informationApprovedGetListAPI(page.value)
  informationList.value = data.value
  total.value = data.count
}
await getList()

// 搜索事件函数
const handleEnter = async () => {
  await getList()
  informationList.value = informationList.value?.filter((item) => item.title.includes(search.value))
}

// 改变页码和每页条数的函数 
const onChange = async (currentPage: number, pageSize: number) => {
  if (page.value.itemsPerPage === pageSize) {
    page.value.page = currentPage
    await getList()
  } else {
    page.value.page = 1
    page.value.itemsPerPage = pageSize
    await getList()
  }
}

// 资讯点击事件
const onInformation = (id:number) => {
    router.push(`/informationInfo?id=${id}`)
}
</script>
<template>
  <div>
    <div class="nav">
      <el-form :inline="true">
        <el-form-item label="标题：">
          <el-input v-model="search" style="width: 250px" placeholder="请输入关键字" clearable :suffix-icon="Search"
            @clear="onClear"/>
            <el-button type="primary" :icon="Search" @click="handleEnter">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="main">
      <ul>
        <li class="item" v-for="(item, index) in informationList" :key="item.id" @click="onInformation(item.id)">
          <div class="main-title"> {{ index + 1 }} {{ item.title }}</div>
          <div class="main-time">{{ formDate(item.time) }}</div>
        </li>
      </ul>
    </div>
    <!-- 分页部分 -->
    <div class="pagination">
      <el-pagination v-model:current-page="page.page" v-model:page-size="page.itemsPerPage" :background="true"
        layout="total ,jumper, prev, pager, next" :total="total" @change="onChange" />
    </div>
  </div>
</template>

    
<style scoped lang="scss">
.nav {
  background: white;
  padding: 30px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f1f1f1;
  margin-top: 20px;

  ::v-deep label {
    font-size: 20px;
    font-weight: bold;
  }

  ::v-deep .el-input__wrapper {
    border: 1px red solid;
  }
}

.main {
  background: white;
  padding: 20px;

  ul {
    margin: 0;
    padding: 0;
  }

  .item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    font-size: 18px;
  }
}

.pagination {
  background: white;
  padding: 20px;
  display: flex;
  justify-content: center;
}
</style>
