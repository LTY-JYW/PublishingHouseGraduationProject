<script lang="ts" setup>
import { ref } from 'vue'
// 导入API
import { categoryListAPI } from '@/api/category2'
import { booksGetListNoPageAPI } from '@/api/books'
// 导入API类型
import type { categoryListType } from '@/api/category2'
import type { BooksResListType } from '@/api/books'
import type { ByType } from '@/api/results'
// 导入el类型
import type { CascaderProps } from 'element-plus'
// 导入el图标
import { Search } from '@element-plus/icons-vue'

// 分类变量
const categoryList = ref<categoryListType>()
// 获取分类函数
const getCategoryList = async () => {
  const { data: { data } } = await categoryListAPI()
  categoryList.value = data
}
await getCategoryList()

// 图书提交变量
const bydes = ref<ByType>({
  by: 'popularity',
  des: 'DESC'
})
// 获取图书列表变量
const booksList = ref<BooksResListType>()
// 获取图书列表函数
const getList = async () => {
  const { data: { data } } = await booksGetListNoPageAPI(bydes.value)
  booksList.value = data.value
}
await getList()

// 搜索变量
const searchData = ref('')
// 清除图标点击事件
const onClear = () => {
  searchData.value = ''
}

// 点击分类事件函数
const onCategory = async (id:number) => {
  await getList()
  booksList.value = booksList.value?.filter((item)=> item.cid === id)
  console.log(booksList.value);
  
}
</script>
<template>
  <div class="box">
    <div class="category">
      <div class="category-inco"> <el-icon size="45">
          <Menu />
        </el-icon> 图书分类</div>
      <el-menu class="catgeory-main">
        <el-sub-menu v-for="item in categoryList" :index="'一级分类' + item.value"  :key="item.value">
          <template #title>
            <span>{{ item.label }}</span>
          </template>
          <el-menu-item class="catgeory-main-itemc" v-for="itemc in item.children" :index="'二级分类' + itemc.value" 
            :key="itemc.value" @click="onCategory(itemc.value)">{{ itemc.label }}</el-menu-item>
        </el-sub-menu>
      </el-menu>

    </div>
    <div class="books">
      <div class="books-search">
        <el-form :inline="true">
          <!-- 书名和作者搜索 -->
          <el-form-item>
            <el-input v-model="searchData" placeholder="请输入想搜索的书名" clearable :suffix-icon="Search" @clear="onClear"
              size="large" />
          </el-form-item>
        </el-form>
      </div>
      <div class="books-item">
        <div class="booksitem" v-for="item in booksList" :key="item.id">
          <img :src="item.cover" alt="">
        </div>
      </div>
    </div>
  </div>
</template>
    
    
<style scoped lang="scss">
.box {
  display: flex;
  justify-content: space-between;

  .category {
    background: white;

    .category-inco {
      background: #d53435;
      width: 190px;
      font-size: 30px;
      color: white;
      display: flex;
      padding: 10px;
      justify-content: space-between;
    }

    .catgeory-main {
      width: 210px;
    }
  }

  .books {
    width: 1000px;
    background: white;

    .books-search {
      margin-top: 20px;
      margin-left: 750px;
    }

    .books-item {
      display: flex;
      .booksitem {
        margin: 20px;
        img {
          width: 150px;
          height: 190px;
        }
      }
    }


  }
}
</style>