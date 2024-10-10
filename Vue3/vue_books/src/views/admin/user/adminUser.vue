<script lang="ts" setup>
import { ref } from 'vue'
// 导入API
import { userGetListAPI, userEnableAPI, userUpDissableAPI } from '@/api/user'
import { auditIsOkAuthorAPI,auditIsNoAuthorAPI } from '@/api/audit'
// 导入API类型
import type { UserListType } from '@/api/user'
import type { PageType } from '@/api/results'
// 导入默认头像地址
import { URL } from '@/utils/defaultAvatar'
// 导入el图标
import { Search, WarnTriangleFilled, SuccessFilled } from '@element-plus/icons-vue'
// 导入el组件
import { ElMessageBox } from 'element-plus'
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

//控制加载状态变量
const loading = ref(false)
// 表格数据
const tableData = ref<UserListType>()
// 接口返回数据的总条数
const total = ref<number>(0)
// 查询资讯信息提交数据变量
const selData = ref<PageType>({
  page: 1,
  itemsPerPage: 5
})

// 获取用户列表函数
const getList = async () => {
  loading.value = true
  const { data } = await userGetListAPI(selData.value)
  if (data.data === undefined) {
    tableData.value = undefined
    loading.value = false
    return
  }
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

// 搜索部分
// 状态搜索变量
const searchDisable = ref<number>()
// 身份搜索变量
const searchAuthor = ref<number>()
// 搜索框变量
const searchData = ref('')
// 身份选择器改变事件函数
const onSearchChange = async () => {
  await getList()
  if (searchDisable.value && searchAuthor.value && searchData.value) {
    return tableData.value = tableData.value?.filter((item) => (item.nickname.includes(searchData.value) || item.email?.includes(searchData.value)) && item.isAuthor == searchAuthor.value && item.disable == searchDisable.value)
  }
  if (searchAuthor.value && searchData.value) {
    return tableData.value = tableData.value?.filter((item) => (item.nickname.includes(searchData.value) || item.email?.includes(searchData.value)) && item.isAuthor == searchAuthor.value)
  }
  if (searchDisable.value && searchData.value) {
    return tableData.value = tableData.value?.filter((item) => (item.nickname.includes(searchData.value) || item.email?.includes(searchData.value)) && item.disable == searchDisable.value)
  }
  if (searchDisable.value && searchAuthor.value) {
    return tableData.value = tableData.value?.filter((item) => item.isAuthor == searchAuthor.value && item.disable == searchDisable.value)

  }
  if (searchAuthor.value) {
    return tableData.value = tableData.value?.filter((item) => item.isAuthor == searchAuthor.value)
  }
  if (searchDisable.value) {
    return tableData.value = tableData.value?.filter((item) => item.disable == searchDisable.value)
  }
  if (searchData.value) {
    console.log(tableData.value);

    return tableData.value = tableData.value?.filter((item) => item.nickname.includes(searchData.value) || item.email?.includes(searchData.value))
  }
}
// 状态选择器清除图标事件函数
const onDisableClear = async () => {
  searchDisable.value = undefined
  await onSearchChange()
}
// 身份选择器清除图标事件函数
const onAuthorClear = async () => {
  searchAuthor.value = undefined
  await onSearchChange()
}
// 搜索框清除图标事件函数
const onClear = async () => {
  searchData.value = ''
  searchAuthor.value = undefined
  searchDisable.value = undefined
  await getList()
}

// 表格操作部分
// 修改分类回显数据类型
// 启用用户事件函数
const headEnable = async (id: number) => {
  if (isAdmin.value) {
    await userEnableAPI({ id })
    await getList()
  }else{
    await auditIsOkAuthorAPI(id)
    await getList()
  }

}
// 禁用用户事件函数
const headDissable = async (id: number) => {
  if (isAdmin.value) {
    ElMessageBox.confirm('你确定要禁用该用户吗？', '确认对话框', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    // 用户点击确定后的操作
    await userUpDissableAPI({ id })
    await getList()
  }).catch(() => {
    // 用户点击取消后的操作
  });
  }else{
    await auditIsNoAuthorAPI(id)
    await getList()
  }

}
</script>
<template>
  <pageComponent title="二级分类管理">
    <!-- 搜索表单部分 -->
    <el-form :inline="true">
      <!--  状态搜索 -->
      <el-form-item label="状态">
        <el-select style="width: 200px" v-model="searchDisable" @change="onSearchChange" clearable
          @clear="onDisableClear">
          <el-option label="正常" value="0"></el-option>
          <el-option label="禁用" value="1"></el-option>
        </el-select>
      </el-form-item>
      <!-- 身份搜索 -->
      <el-form-item label="身份">
        <el-select style="width: 200px" v-model="searchAuthor" @change="onSearchChange" clearable @clear="onAuthorClear">
          <el-option label="普通用户" value="0"></el-option>
          <el-option label="作者" value="1"></el-option>
          <el-option label="审核中" value="2"></el-option>
        </el-select>
      </el-form-item>
      <!-- 分类名搜索 -->
      <el-form-item>
        <el-input v-model="searchData" style="width: 250px" placeholder="请输入用户昵称或邮箱" clearable :suffix-icon="Search"
          @clear="onClear" />
        <el-button type="primary" :icon="Search" @click="onSearchChange">搜索</el-button>
        <el-button @click="onClear">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格部分 -->
    <el-table stripe style="width: 100%" :data="tableData" v-loading="loading" height="680" table-layout="auto">
      <el-table-column label="头像" width="180">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <el-avatar :src='scope.row.avatar' v-if="scope.row.avatar" />
            <el-avatar :src='URL' v-else />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="nickname" label="昵称" />
      <el-table-column prop="username" label="账号" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column prop="briefly" label="简介" />
      <el-table-column label="状态" width="120px">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <div v-if="scope.row.disable === 0" class="table_tag">
              <el-tag type="primary" round effect="dark">正常</el-tag>
            </div>
            <div v-else-if="scope.row.disable === 1"> <el-tag type="danger" round effect="dark">禁用</el-tag></div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="身份" width="120px">
        <template #default="scope">
          <div v-if="scope.row.isAuthor === 0"><el-tag type="primary" round effect="dark">普通用户</el-tag></div>
          <div v-else-if="scope.row.isAuthor === 1"> <el-tag type="success" round effect="dark">作者</el-tag></div>
          <div v-else-if="scope.row.isAuthor === 2"> <el-tag type="warning" round effect="dark">审核中</el-tag></div>
        </template>
      </el-table-column>
      <el-table-column prop="aValue" label="审核员" />
      <!-- 表格操作部分 -->
      <el-table-column label="操作" class="table_operation" width="50px">
        <template #default="scope">
          <el-button-group>
            <el-button type="primary" :icon="SuccessFilled" circle plain @click="headEnable(scope.row.id)"
              class="table_operation_button" size="large" />
            <el-button type="danger" :icon="WarnTriangleFilled" circle plain @click="headDissable(scope.row.id)"
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
  </pageComponent>
</template>
    
<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 300px;
}
</style>