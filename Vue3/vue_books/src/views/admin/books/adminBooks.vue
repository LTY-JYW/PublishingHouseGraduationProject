<script lang="ts" setup>
import { ref, watch } from "vue";

// 导入el组件
import { ElMessageBox } from 'element-plus'
import type { FormRules, FormInstance } from 'element-plus'
// 导入el图标
import { Edit, Delete, Search, DocumentAdd, SuccessFilled, WarnTriangleFilled } from '@element-plus/icons-vue'
// 导入时间处理函数
import { formDate } from '@/utils/dayjs'
// 导入默认封面地址
import { URL } from '@/utils/defaultAvatar'
// 导入类型
import type { BooksInfoType } from '@/api/books'
// 导入后端接口函数
import { booksGetListAPI, booksGetListOveryAPI, booksUpInfoAPI, booksDelAPI, booksRestoreAPI } from '@/api/books'
import { category2NameAPI } from '@/api/category2'
import { auditIsOkBookAPI,auditIsNoBookAPI} from '@/api/audit'

// 导入后端数据类型
import type { BooksResListType } from '@/api/books'
import type { CategoryNameType } from '@/api/category'
// 导入pinia
import { useUserStore } from '@/stores/user'

// 使用pinan
const userStore = useUserStore()
// 判断管理员和审核员变量
const isAdmin = ref<boolean>()
if (userStore.permissions === 0) {
  isAdmin.value = true
} else if (userStore.permissions === 1) {
  isAdmin.value = false
}
// 当前页码
const page = ref(1)
// 每页显示条数
const itemsPerPage = ref(5)
// 表格数据
const tableData = ref<BooksResListType>()
// 获取表单数据变量
const ruleFormRef = ref<FormInstance>()
// 数据总条数
const total = ref<number>(0)
// 是否为加载状态
const loading = ref<boolean>(false)
// 是否显示删除图书
const isDel = ref(false)

// 获取文章分类名
// 获取文章分类名变量
const category2Name = ref<CategoryNameType>()
// 文章分类列表函数
const getCategoryName = async () => {
  const { data } = await category2NameAPI()
  category2Name.value = data.data
}
// 一开始调用函数获取分类名
await getCategoryName()

// 获取图书列表函数
const getList = async () => {
  loading.value = true
  if (isDel.value) {
    const { data } = await booksGetListOveryAPI({
      page: page.value,
      itemsPerPage: itemsPerPage.value
    })
    if (data.data === undefined) {
      tableData.value = undefined
      loading.value = false
      return
    }
    if (data.data === undefined) {
      tableData.value = undefined
      loading.value = false
      return
    }
    tableData.value = data.data.value
    total.value = data.data.count
    loading.value = false
  } else {
    const { data } = await booksGetListAPI({
      page: page.value,
      itemsPerPage: itemsPerPage.value,
      by:'id',
      des:'DESC'
    })
    if (data.data === undefined) {
      tableData.value = undefined
      loading.value = false
      return
    }
    if (data.code !== 0) {
      tableData.value = undefined

    } else {
      tableData.value = data.data.value
      total.value = data.data.count
    }
    loading.value = false
  }
}
// 一开始便调用函数获取表格数据
await getList()
// 监听是否显示删除图书变量的值
// 使用 watch 函数来监听变化
watch(isDel, async () => {
  await getList()
});

// 改变页码和每页条数的函数 
const onChange = async (currentPage: number, pageSize: number) => {
  if (itemsPerPage.value === pageSize) {
    page.value = currentPage
    await getList()
  } else {
    page.value = 1
    itemsPerPage.value = pageSize
    await getList()
  }
}

// 搜索分类cid
const searchCid = ref<number>()
// 搜索状态变量
const searchDisable = ref<number>()
// 书名、作者搜索
const searchName = ref()
// 搜索事件函数
const onSearchChange = async () => {
  await getList()
  if (searchCid.value && searchDisable.value && searchName.value) {
    return tableData.value = tableData.value?.filter((item) => (item.name.includes(searchName.value) || item.uValue.includes(searchName.value)) && item.cid === searchCid.value && item.disable === searchDisable.value)
  }
  if (searchCid.value && searchDisable.value) {
    return tableData.value = tableData.value?.filter((item) => item.cid === searchCid.value && item.disable === searchDisable.value)
  }
  if (searchCid.value && searchName.value) {
    return tableData.value = tableData.value?.filter((item) => (item.name.includes(searchName.value) || item.uValue.includes(searchName.value)) && item.cid === searchCid.value)
  }
  if (searchDisable.value && searchName.value) {
    return tableData.value = tableData.value?.filter((item) => (item.name.includes(searchName.value) || item.uValue.includes(searchName.value)) && item.disable === searchDisable.value)
  }
  if (searchCid.value) {
    return tableData.value = tableData.value?.filter((item) => item.cid === searchCid.value)
  }
  if (searchDisable.value) {
    return tableData.value = tableData.value?.filter((item) => item.disable === searchDisable.value)
  }
  if (searchName.value) {
    return tableData.value = tableData.value?.filter((item) => (item.name.includes(searchName.value) || item.uValue.includes(searchName.value)))
  }
}
// 文章分类清除事件函数
const onCidClear = async () => {
  searchCid.value = undefined
  await onSearchChange()
}
// 搜索状态清除事件函数
const onDisableClear = async () => {
  searchDisable.value = undefined
  await onSearchChange()
}
// 重置函数
const reset = async () => {
  searchCid.value = undefined
  searchDisable.value = undefined
  searchName.value = ''
  await getList()
}

// 搜索框取消图标触发函数
const onClear = async () => {
  searchName.value = ''
  await getList()
}

// 表格操作
const isDrawer = ref(false)
// 修改图书信息校验规则
const booksRules: FormRules<BooksInfoType> = {
  cid: [
    {
      required: true,
      message: '请选择分类',
      trigger: 'blur'
    }
  ],
  topic: [
    {
      required: true,
      message: '请选择分类',
      trigger: 'blur'
    }
  ],
  name: [
    {
      required: true,
      message: '请输入书籍名称',
      trigger: 'blur'
    }
  ],
  profile: [
    {
      required: true,
      message: '请输入书籍名称',
      trigger: 'blur'
    }
  ],
  edition: [
    {
      required: true,
      message: '请输入书籍名称',
      trigger: 'blur'
    }
  ],
}
// 修改图书信息变量
const booksDate = ref<BooksInfoType>({
  id: 0,
  cid: '0',
  name: '',
  profile: '',
  edition: 0,
  price: 0,
  pages: 0,
  number: 0,
  topic: '',
  cover: ''
})
// 更新图书函数
const headEdit = async (id: number) => {
  isDrawer.value = true
  booksDate.value = {
    id: tableData.value ? tableData.value.filter(item => item.id === id)[0].id : 0,
    cid: tableData.value ? tableData.value.filter(item => item.id === id)[0].cid.toString() : '0',
    name: tableData.value ? tableData.value.filter(item => item.id === id)[0].name : '',
    profile: tableData.value ? tableData.value.filter(item => item.id === id)[0].profile : '',
    edition: tableData.value ? tableData.value.filter(item => item.id === id)[0].edition : 0,
    price: tableData.value ? tableData.value.filter(item => item.id === id)[0].price : 0,
    pages: tableData.value ? tableData.value.filter(item => item.id === id)[0].pages : 0,
    number: tableData.value ? tableData.value.filter(item => item.id === id)[0].number : 0,
    topic: tableData.value ? tableData.value.filter(item => item.id === id)[0].topic : '',
    cover: tableData.value ? tableData.value.filter(item => item.id === id)[0].cover : ''
  }
}
// 删除图书函数
const headDelete = async (id: number) => {
  ElMessageBox.confirm('你确定要删除这个吗？', '确认对话框', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    // 用户点击确定后的操作
    await booksDelAPI(id)
    await getList()
  }).catch(() => {
    // 用户点击取消后的操作
  });

}
// 恢复图书函数
const headRestore = async (id: number) => {
  ElMessageBox.confirm('你确定要恢复这本图书吗？', '确认对话框', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    // 用户点击确定后的操作
    await booksRestoreAPI(id)
    await getList()
  }).catch(() => {
    // 用户点击取消后的操作
  });
}
// 确认修改图书函数
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      await booksUpInfoAPI(booksDate.value)
      isDrawer.value = false
      await getList()
    } else {
      console.log('error submit!', fields)
    }
  })
}
// 同意图书事件函数
const headAgree = async (id:number) => {
  await auditIsOkBookAPI(id)
  await getList()
}
// 驳回图书事件函数
const headReject = async (id:number) => {
  await auditIsNoBookAPI(id)
}

</script>

<template>
  <pageComponent title="审核员管理">
    <!-- 搜索表单部分 -->
    <el-form :inline="true">
      <!-- 右边搜索部分 -->
      <el-form-item label="文章分类">
        <el-select style="width: 200px" v-model="searchCid" @change="onSearchChange" clearable @clear="onCidClear">
          <el-option v-for="item in category2Name" :key="item.id" :value="item.id" :label="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发布状态">
        <el-select style="width: 200px" v-model="searchDisable" @change="onSearchChange" clearable
          @clear="onDisableClear">
          <el-option label="审核通过" value="0"></el-option>
          <el-option label="审核失败" value="1"></el-option>
          <el-option label="审核中" value="2"></el-option>
        </el-select>
      </el-form-item>
      <!-- 书名和作者搜索 -->
      <el-form-item>
        <el-input v-model="searchName" style="width: 250px" placeholder="请输入想搜索的书名或作者" clearable :suffix-icon="Search"
          @clear="onClear" />
        <el-button type="primary" :icon="Search" @click="onSearchChange">搜索</el-button>
        <el-button type="primary" :icon="Search" @click="reset">重置</el-button>
      </el-form-item>
      <!-- 是否显示删除部分 -->
      <el-form-item label="是否显示删除图书" v-if="isAdmin">
        <el-switch v-model="isDel" />
      </el-form-item>
    </el-form>

    <!-- 表格部分 -->
    <el-table stripe style="width: 100%" :data="tableData" v-loading="loading" height="680" table-layout="auto">
      <el-table-column label="封面" prop="cover">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <el-avatar :src='scope.row.cover' v-if="scope.row.cover" />
            <el-avatar :src='URL' v-else />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="书名" />
      <el-table-column prop="profile" label="简介" />
      <el-table-column prop="topic" label="主题词" />
      <el-table-column prop="time" label="出版时间">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <span>{{ formDate(scope.row.time) }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="cValue" label="分类" />
      <el-table-column prop="uValue" label="作者" />
      <el-table-column prop="edition" label="版次" />
      <el-table-column prop="price" label="单价" />
      <el-table-column prop="pages" label="页数" />
      <el-table-column prop="number" label="卷数" />
      <el-table-column prop="popularity" label="人气" />
      <el-table-column prop="aValue" label="审核员" />
      <el-table-column label="审核状态" width="120px">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <div v-if="scope.row.disable === 0" class="table_tag">
              <el-tag type="success" round effect="dark">审核通过</el-tag>
            </div>
            <div v-else-if="scope.row.disable === 1"> <el-tag type="danger" round effect="dark">审核失败</el-tag></div>
            <div v-else-if="scope.row.disable === 2"> <el-tag type="warning" round effect="dark">审核中</el-tag></div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="删除状态" width="120px">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <div v-if="scope.row.isdelete === 0" class="table_tag">
              <el-tag type="success" round effect="dark">正常</el-tag>
            </div>
            <div v-else class="table_tag">
              <el-tag type="danger" round effect="dark">已删除</el-tag>
            </div>
          </div>
        </template>
      </el-table-column>
      <!-- 表格操作部分 -->
      <el-table-column label="操作" class="table_operation" width="50px">
        <template #default="scope">
          <el-button-group v-if="isAdmin">
            <el-button type="primary" :icon="Edit" circle plain @click="headEdit(scope.row.id)"
              class="table_operation_button" size="large" />
            <el-button type="danger" :icon="Delete" circle plain @click="headDelete(scope.row.id)"
              class="table_operation_button" size="large" />
            <el-button v-show="isDel" type="danger" :icon="DocumentAdd" circle plain @click="headRestore(scope.row.id)"
              class="table_operation_button" size="large" />
          </el-button-group>
          <el-button-group v-else>
            <el-button type="primary" :icon="SuccessFilled" circle plain @click="headAgree(scope.row.id)"
              class="table_operation_button" size="large" />
            <el-button type="danger" :icon="WarnTriangleFilled" circle plain @click="headReject(scope.row.id)"
              class="table_operation_button" size="large" />
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页部分 -->
    <div class="pagination">
      <el-pagination v-model:current-page="page" v-model:page-size="itemsPerPage" :page-sizes="[1, 5, 10, 15]"
        :background="true" layout="jumper, total, sizes, prev, pager, next" :total="total" @change="onChange" />
    </div>

    <!-- 修改图书信息抽屉 -->
    <el-drawer v-model="isDrawer" title="更新图书" direction="rtl">
      <!-- 更新图书模块 -->
      <el-form size="large" autocomplete="off" :model="booksDate" :rules="booksRules" ref="ruleFormRef">
        <!-- 表单数据区域 -->
        <el-form-item prop="name" label="书名">
          <el-input placeholder="请输入书名" v-model="booksDate.name"></el-input>
        </el-form-item>
        <el-form-item prop="topic" label="主题词">
          <el-input placeholder="请输入主题词" v-model="booksDate.topic"></el-input>
        </el-form-item>
        <el-form-item label="分类">
          <el-select style="width: 200px" v-model="booksDate.cid" prop="cid">
            <el-option v-for="item in category2Name" :key="item.id" :value="item.id" :label="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="price" label="单价">
          <el-input placeholder="请输入单价" v-model="booksDate.price"></el-input>
        </el-form-item>
        <!-- 表单按钮区域 -->
        <el-form-item>
          <el-button class="button" type="primary" auto-insert-space @click="submitForm(ruleFormRef)">
            确认
          </el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </pageComponent>
</template>
    
<style scoped lang="scss"></style>
