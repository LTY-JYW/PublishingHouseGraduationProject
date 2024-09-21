<script lang="ts" setup>
import { ref, computed } from 'vue'
// 导入API
import { categoryGetListAPI, categoryDeleteAPI, categoryAddAPI } from '@/api/category'
// 导入API类型
import type { CategoryType, CategoryAddType } from '@/api/category'
import type { PageType } from '@/api/results'

// 导入统一错误处理函数
import { isOk } from '@/utils/funtion'

// 导入el图标
import { Delete, Search, Edit, DocumentAdd } from '@element-plus/icons-vue'
// 导入el类型
import type { FormRules, FormInstance } from 'element-plus'
// 导入el组件
import { ElMessageBox, ElMessage } from 'element-plus'

//控制加载状态变量
const loading = ref(false)
// 表格数据
const tableData = ref<CategoryType>()
// 接口返回数据的总条数
const total = ref<number>()
// 查询资讯信息提交数据变量
const selData = ref<PageType>({
  page: 1,
  itemsPerPage: 5
})

// 获取资讯列表函数
const getList = async () => {
  loading.value = true
  const { data } = await categoryGetListAPI(selData.value)
  isOk(data)
  tableData.value = data.data.value
  total.value = data.data.count
  loading.value = false
}
// 进入页面就调用获取资讯列表函数
await getList()
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

// 表格操作部分
// 修改一级分类事件函数
const headEdit = async (id: number) => {

}
// 删除一级分类时间函数
const headDelete = async (id: number) => {
  ElMessageBox.confirm('你确定要删除吗？', '确认对话框', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    // 用户点击确定后的操作
    loading.value = true
    const { data } = await categoryDeleteAPI(id)
    isOk(data)
    loading.value = false
    ElMessage.success('删除成功！')
    await getList()
  }).catch(() => {
    // 用户点击取消后的操作
  });
}

// 添加一级分类
// 控制抽屉显示隐藏变量
const isDrawer = ref(false)
// 一级分类添加表单变量
const addCategoryData = ref<CategoryAddType>({
  name: '',
  profile: ''
})
// 添加一级分类校验变量
const addCategoryRules: FormRules<CategoryAddType> = {
  name: [
    {
      required: true,
      message: '请输入分类名',
      trigger: 'blur'
    }
  ],
  profile: [
    {
      required: true,
      message: '请输入简介',
      trigger: 'blur'
    }
  ],
}
// 获取表单数据变量
const ruleFormRef = ref<FormInstance>()
// 确认添加图书事件函数
const submitForm = async (formEl: FormInstance | undefined, isAdd: string) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      if (isAdd === 'add') {
        const res = await categoryAddAPI(addCategoryData.value)
        isOk(res.data)
        ElMessage.success('添加成功！')
      }else if (isAdd === 'updata') {
        console.log();
        
      }

    } else {
      console.log('error submit!', fields)
    }
  })
  await getList()
  isDrawer.value = false
}

</script>
<template>
  <pageComponent title="一级分类管理">
    <!-- 添加资讯插槽 -->
    <template #button>
      <el-button plain type="primary" round @click="isDrawer = true">添加资讯</el-button>
    </template>
    <!-- 表格部分 -->
    <el-table stripe style="width: 100%" :data="tableData" v-loading="loading" height="680" table-layout="auto">
      <el-table-column prop="name" label="分类名" />
      <el-table-column prop="profile" label="简介" />
      <!-- 表格操作部分 -->
      <el-table-column label="操作" class="table_operation" width="50px">
        <template #default="scope">
          <el-button-group>
            <el-button type="primary" :icon="Edit" circle plain @click="headEdit(scope.row.id)"
              class="table_operation_button" size="large" />
            <el-button type="danger" :icon="Delete" circle plain @click="headDelete(scope.row.id)"
              class="table_operation_button" size="large" />
          </el-button-group>
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
      <el-form size="large" autocomplete="off" :model="addCategoryData" :rules="addCategoryRules" ref="ruleFormRef">
        <!-- 表单数据区域 -->
        <el-form-item prop="title" label="分类名" label-position="top">
          <el-input placeholder="请输入分类名" v-model="addCategoryData.name"></el-input>
        </el-form-item>
        <el-form-item prop="main" label="简介" label-position="top">
          <el-input placeholder="请输入简介" v-model="addCategoryData.profile"></el-input>
        </el-form-item>
        <!-- 表单按钮区域 -->
        <el-form-item>
          <el-button class="button" type="primary" auto-insert-space @click="submitForm(ruleFormRef, 'add')">
            确认
          </el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </pageComponent>
</template>
    
<style scoped></style>