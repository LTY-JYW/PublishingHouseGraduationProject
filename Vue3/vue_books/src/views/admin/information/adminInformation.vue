<script lang="ts" setup>
import { ref, computed } from 'vue'
// 导入API
import { informationGetListAPI, informationDeleteAPI, informationAddAPI } from '@/api/information'
import { auditAdminGetInfo } from '@/api/audit'
// 导入API类型
import type { InformationType } from '@/api/information'
import type { PageByType } from '@/api/results'
import type { InformationAddType } from '@/api/information'
// 导入统一错误处理函数
import { isOk } from '@/utils/funtion'
// 导入时间处理函数
import { formDate } from '@/utils/dayjs'
// 导入el图标
import { Delete, Search } from '@element-plus/icons-vue'
// 导入el类型
import type { FormRules, FormInstance } from 'element-plus'
// 导入el组件
import { ElMessageBox, ElMessage } from 'element-plus'

//控制加载状态变量
const loading = ref(false)
// 表格数据
const tableData = ref<InformationType>()
// 接口返回数据的总条数
const total = ref<number>()
// 查询资讯信息提交数据变量
const selData = ref<PageByType>({
  page: 1,
  itemsPerPage: 5,
  by: 'id',
  des: 'asc'
})
// 审核员名称集合类型
type AuditNameListType = {
  [key: number]: string
}
// 审核员名称集合
const auditName = ref<AuditNameListType>({});
// 根据aid查询审核员名称信息
const getAuditInfo = async (id: number) => {
  if (id === undefined || !id) {
    return
  }
  const { data } = await auditAdminGetInfo(id)
  auditName.value[id] = data.data[0].nickname
}
// 计算属性，用于根据 id 获取审核员名称
const getAuditName = computed(() => {
  return (id: number) => auditName.value[id] || '暂无审核员';
});

// 获取资讯列表函数
const getList = async () => {
  loading.value = true
  const { data } = await informationGetListAPI(selData.value)
  isOk(data)
  tableData.value = data.data.value
  total.value = data.data.count
  // 在组件初始化时，预先获取所有分类信息
  tableData.value.forEach((row) => {
    getAuditInfo(row.audit_id)
  });

  loading.value = false
}
// 进入页面就调用获取资讯列表函数
await getList()


// 搜索部分
// 搜索框变量
const searchData = ref('')
// 发布状态变量
const searchStatus = ref<number>()
// 时间选择器变量
const datePickerData = ref('')
// 时间选择器快捷按钮变量
const shortcuts = [
  {
    text: '上周',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: '上个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
]
// 发布状态选择器改变事件函数
const onSearchChange = async () => {
  await getList()
  if (searchData.value) {
    tableData.value = tableData.value?.filter((item) => item.title.includes(searchData.value) && item.disable == searchStatus.value)
  } else {
    tableData.value = tableData.value?.filter((item) => item.disable == searchStatus.value)
  }
}
// 时间选择器时间改变事件函数
const onChangeTime = async () => {
  // 将时间选择器转化为Date类型
  const dateAgo = new Date(datePickerData.value[0])
  const dateAfter = new Date(datePickerData.value[1])
  await getList()
  if (searchData.value) {
    tableData.value = tableData.value?.filter((item) => (item.title.includes(searchData.value)) && (new Date(item.time) >= dateAgo && new Date(item.time) <= dateAfter))
  } else {
    tableData.value = tableData.value?.filter((item) => new Date(item.time) >= dateAgo && new Date(item.time) <= dateAfter)
  }
}
// 搜索按钮事件函数
const onDataSearch = async () => {
  await getList()
  // 将时间选择器转化为Date类型
  const dateAgo = new Date(datePickerData.value[0])
  const dateAfter = new Date(datePickerData.value[1])
  if (searchStatus.value && datePickerData.value) {
    return tableData.value = tableData.value?.filter((item) => item.title.includes(searchData.value) && item.disable == searchStatus.value && (new Date(item.time) >= dateAgo && new Date(item.time) <= dateAfter))
  }
  if (searchStatus.value) {
    return tableData.value = tableData.value?.filter((item) => item.title.includes(searchData.value) && item.disable == searchStatus.value)
  }
  if (datePickerData.value) {

    return tableData.value = tableData.value?.filter((item) => (item.title.includes(searchData.value)) && (new Date(item.time) >= dateAgo && new Date(item.time) <= dateAfter))
  }
  tableData.value = tableData.value?.filter((item) => item.title.includes(searchData.value))
}
// 搜索框清除图标事件函数
const onClear = async () => {
  await getList()
}

// 表格操作部分
// 删除资讯事件函数
const headDelete = async (id: number) => {
  ElMessageBox.confirm('你确定要删除吗？', '确认对话框', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    // 用户点击确定后的操作
    const res = await informationDeleteAPI(id)
    isOk(res.data)
    ElMessage.success('删除成功')
    await getList()
  }).catch(() => {
    // 用户点击取消后的操作
  });
}
// 分页部分
// 页码改变事件函数
const onChange = async (currentPage: number, pageSize: number) => {
  if (selData.value.itemsPerPage === pageSize) {
    selData.value.page = currentPage
    await getList()
  } else {
    selData.value.page = 1
    selData.value.itemsPerPage = pageSize
    await getList()
  }
}

// 显示隐藏抽屉变量
const isDrawer = ref(false)
// 添加图书表单变量
const addInforData = ref<InformationAddType>({
  title: '',
  main: ''
})
// 添加图书校验规则
const informationRules: FormRules<InformationAddType> = {
  title: [
    {
      required: true,
      message: '请输入标题',
      trigger: 'blur'
    }
  ],
  main: [
    {
      required: true,
      message: '请输入内容',
      trigger: 'blur'
    }
  ],
}
// 获取表单数据变量
const ruleFormRef = ref<FormInstance>()
// 确认添加图书事件函数
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const res = await informationAddAPI(addInforData.value)
      isOk(res.data)
      ElMessage.success('添加成功！')
    } else {
      console.log('error submit!', fields)
    }
  })
  await getList()
  isDrawer.value = false
}


</script>
<template>
  <pageComponent title="资讯管理">
    <!-- 添加资讯插槽 -->
    <template #button>
      <el-button plain type="primary" round @click="isDrawer = true">添加资讯</el-button>
    </template>
    <!-- 搜索表单部分 -->
    <el-form :inline="true">
      <!-- 发布状态搜索 -->
      <el-form-item label="发布状态">
        <el-select style="width: 200px" v-model="searchStatus" @change="onSearchChange">
          <el-option label="审核通过" value="0"></el-option>
          <el-option label="审核失败" value="1"></el-option>
          <el-option label="审核中" value="2"></el-option>
        </el-select>
      </el-form-item>
      <!-- 日期返回搜索 -->
      <el-form-item label="发布状态">
        <el-date-picker v-model="datePickerData" type="daterange" unlink-panels range-separator="--->"
          start-placeholder="Start date" end-placeholder="End date" :shortcuts="shortcuts" @change="onChangeTime" />
      </el-form-item>

      <!-- 书名和作者搜索 -->
      <el-form-item>
        <el-input v-model="searchData" style="width: 250px" placeholder="请输入想搜索标题" clearable :suffix-icon="Search"
          @clear="onClear" />
        <el-button type="primary" :icon="Search" @click="onDataSearch">搜索</el-button>
        <el-button @click="onClear">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格部分 -->
    <el-table stripe style="width: 100%" :data="tableData" v-loading="loading" height="680" table-layout="auto">
      <el-table-column prop="title" label="标题" />
      <el-table-column prop="main" label="内容" />
      <el-table-column prop="time" label="时间">
        <template #default="scope">
          <span>{{ formDate(scope.row.time) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="count" label="浏览量" />
      <el-table-column label="审核状态" width="120px">
        <template #default="scope">
          <div v-if="scope.row.disable === 0" class="table_tag">
            <el-tag type="success" round effect="dark">审核通过</el-tag>
          </div>
          <div v-else-if="scope.row.disable === 1"> <el-tag type="danger" round effect="dark">审核失败</el-tag></div>
          <div v-else-if="scope.row.disable === 2"> <el-tag type="warning" round effect="dark">审核中</el-tag></div>
        </template>
      </el-table-column>
      <el-table-column label="审核员">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <span>{{ getAuditName(scope.row.audit_id) }}</span>
          </div>
        </template>
      </el-table-column>
      <!-- 表格操作部分 -->
      <el-table-column label="操作" class="table_operation" width="50px">
        <template #default="scope">
          <el-button type="danger" :icon="Delete" circle plain @click="headDelete(scope.row.id)"
            class="table_operation_button" size="large" />
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页部分 -->
    <div class="pagination">
      <el-pagination v-model:current-page="selData.page" v-model:page-size="selData.itemsPerPage"
        :page-sizes="[5, 10, 15, 20]" :background="true" layout="jumper, total, sizes, prev, pager, next" :total="total"
        @change="onChange" />
    </div>
    <!-- 添加资讯抽屉 -->
    <el-drawer v-model="isDrawer" title="更新图书" direction="rtl">
      <!-- 更新图书模块 -->
      <el-form size="large" autocomplete="off" :model="addInforData" :rules="informationRules" ref="ruleFormRef">
        <!-- 表单数据区域 -->
        <el-form-item prop="title" label="书名" label-position="top">
          <el-input placeholder="请输入书名" v-model="addInforData.title"></el-input>
        </el-form-item>
        <el-form-item prop="main" label="主题词" label-position="top">
          <el-input placeholder="请输入主题词" v-model="addInforData.main"></el-input>
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
    
<style scoped></style>