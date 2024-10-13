<script lang="ts" setup>
import { ref } from 'vue'
// 导入API
import { informationGetListAPI, informationDeleteAPI, informationAddAPI } from '@/api/information'
import { uploadsFileWordAPI, getHtmlAPI } from '@/api/uploads'
import { auditIsOkInformationAPI, auditIsNoInformationAPI } from '@/api/audit'
// 导入API类型
import type { InformationType } from '@/api/information'
import type { PageByType } from '@/api/results'
import type { InformationAddType } from '@/api/information'
// 导入时间处理函数
import { formDate } from '@/utils/dayjs'
// 导入el图标
import { Delete, Search, View, SuccessFilled, WarnTriangleFilled } from '@element-plus/icons-vue'
// 导入el类型
import type { FormRules, FormInstance, UploadInstance, UploadProps, UploadFile, UploadUserFile, UploadRawFile } from 'element-plus'
// 导入el组件
import { ElMessageBox, ElMessage, genFileId } from 'element-plus'
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

// 获取资讯列表函数
const getList = async () => {
  loading.value = true
  const { data } = await informationGetListAPI(selData.value)
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


// 搜索部分
// 搜索框变量
const searchData = ref('')
// 发布状态变量
const searchDisable = ref<number>()
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
// 搜索事件函数
const onSearchChange = async () => {
  await getList()
  // 将时间选择器转化为Date类型
  const dateAgo = new Date(datePickerData.value[0])
  const dateAfter = new Date(datePickerData.value[1])

  if (searchDisable.value && datePickerData.value && searchData.value) {
    return tableData.value = tableData.value?.filter((item) => item.title.includes(searchData.value) && item.disable == searchDisable.value && (new Date(item.time) >= dateAgo && new Date(item.time) <= dateAfter))
  }
  if (searchDisable.value && datePickerData.value) {
    return tableData.value = tableData.value?.filter((item) => item.disable == searchDisable.value && (new Date(item.time) >= dateAgo && new Date(item.time) <= dateAfter))
  }
  if (searchDisable.value && searchData.value) {
    return tableData.value = tableData.value?.filter((item) => item.title.includes(searchData.value) && item.disable == searchDisable.value)
  }
  if (datePickerData.value && searchData.value) {
    return tableData.value = tableData.value?.filter((item) => item.title.includes(searchData.value) && (new Date(item.time) >= dateAgo && new Date(item.time) <= dateAfter))
  }
  if (searchDisable.value) {
    return tableData.value = tableData.value?.filter((item) => item.disable == searchDisable.value)
  }
  if (datePickerData.value) {
    return tableData.value = tableData.value?.filter((item) => (new Date(item.time) >= dateAgo && new Date(item.time) <= dateAfter))
  }
  if (searchData.value) {
    return tableData.value = tableData.value?.filter((item) => item.title.includes(searchData.value))
  }
}
// 清除发布状态事件函数
const onDisableClear = async () => {
  searchDisable.value = undefined
  await onSearchChange()
}
// 清除事件事件函数
const onDateClear = async () => {
  datePickerData.value = ''
  await onSearchChange()
}
// 搜索框清除图标事件函数
const onClear = async () => {
  searchData.value = ''
  await onSearchChange()
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
    await informationDeleteAPI(id)
    await getList()
  }).catch(() => {
    // 用户点击取消后的操作
  });
}
// 查看内容事件函数
// 存储查看内容的HTML变量
const html = ref('')
// 控制查看内容抽屉显示隐藏变量
const isDrawerHtml = ref(false)
const headView = async (main: string) => {
  isDrawerHtml.value = true
  const { data } = await getHtmlAPI(main)
  html.value = data.data.html
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
  ]
}
// 获取表单数据变量
const ruleFormRef = ref<FormInstance>()
// 请求头
const headers = {
  'Content-Type': 'multipart/form-data',
}
// 上传文件变量
const uploadRef = ref<UploadInstance>()
// 创建一个空的 File 对象作为初始值
const emptyFileBlob = new Blob([''], { type: 'text/plain' });
const emptyFileName = 'empty.txt';
const initialFile = new File([emptyFileBlob], emptyFileName);
// 保存要上传的文件的变量
const file = ref<File>(initialFile)
// 文件列表图标常量
const url = 'https://element-plus.org/images/element-plus-logo.svg'
// 上传文件列变量
const fileList = ref<UploadUserFile[]>()
// 校验类型变量
const isOkType = ref(false)
// 添加加载变量
const loadingAdd = ref(false)
// 上传文件改变时的事件函数
const onUploadChange = (uploadFile: UploadFile) => {
  fileList.value = [{ name: uploadFile.name, url }]
  file.value = uploadFile.raw ? uploadFile.raw : initialFile
}
// 重复选择文件时的事件函数
const handleExceed: UploadProps['onExceed'] = (files) => {
  uploadRef.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  uploadRef.value!.handleStart(file)
}
// 上传文件前的校验事件函数
const beforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
  // 修改文件类型检查逻辑
  // 允许的文件类型
  const allowedTypes = ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  if (!allowedTypes.includes(rawFile.type)) {
    ElMessage.error('文件类型不匹配！')
  } else if (rawFile.size / 1024 / 1024 > 1024) {
    ElMessage.error('文件大小不能超过1G')
  } else {
    isOkType.value = true
  }
  return false
}
// 确认添加资讯事件函数
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      loadingAdd.value = true
      // 触发上传验证文件
      uploadRef.value!.submit()
      if (isOkType.value) {
        // 将文件封装到formData中
        const formData = new FormData();
        formData.append('file', file.value);
        // 调用上传接口
        const resFile = await uploadsFileWordAPI(formData)
        // 调用添加接口
        addInforData.value.main = resFile.data.data.url
        await informationAddAPI(addInforData.value)
        loadingAdd.value = false
        isDrawer.value = false
      }
    } else {
      ElMessage.error(fields)
    }
  })
  await getList()
  isDrawer.value = false
}

// 通过审核
const headAgree = async (id: number) => {
  await auditIsOkInformationAPI(id)
  await getList()
}
// 驳回审核
const headReject = async (id: number) => {
  await auditIsNoInformationAPI(id)
  await getList()
}


</script>
<template>
  <pageComponent title="资讯管理">
    <!-- 添加资讯插槽 -->
    <template #button>
      <el-button plain type="primary" round @click="isDrawer = true" v-if="isAdmin">添加资讯</el-button>
    </template>
    <!-- 搜索表单部分 -->
    <el-form :inline="true">
      <!-- 发布状态搜索 -->
      <el-form-item label="发布状态">
        <el-select style="width: 200px" v-model="searchDisable" @change="onSearchChange" clearable
          @clear="onDisableClear">
          <el-option label="审核通过" value="0"></el-option>
          <el-option label="审核失败" value="1"></el-option>
          <el-option label="审核中" value="2"></el-option>
        </el-select>
      </el-form-item>
      <!-- 日期返回搜索 -->
      <el-form-item label="发布日期">
        <el-date-picker v-model="datePickerData" type="daterange" unlink-panels range-separator="--->"
          start-placeholder="Start date" end-placeholder="End date" :shortcuts="shortcuts" @change="onSearchChange"
          clearable @clear="onDateClear" />
      </el-form-item>

      <!-- 书名和作者搜索 -->
      <el-form-item>
        <el-input v-model="searchData" style="width: 250px" placeholder="请输入想搜索标题" clearable :suffix-icon="Search"
          @clear="onClear" />
        <el-button type="primary" :icon="Search" @click="onSearchChange">搜索</el-button>
        <el-button @click="onClear">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格部分 -->
    <el-table stripe style="width: 100%" :data="tableData" v-loading="loading" height="680" table-layout="auto">
      <el-table-column prop="title" label="标题" />
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
      <el-table-column label="审核员" prop="aValue" />
      <!-- 表格操作部分 -->
      <el-table-column label="操作" class="table_operation" width="50px">
        <template #default="scope">
          <el-button-group v-if="isAdmin">
            <el-button type="danger" :icon="Delete" circle plain @click="headDelete(scope.row.id)"
              class="table_operation_button" size="large" />
            <el-button type="danger" :icon="View" circle plain @click="headView(scope.row.main)"
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
      <el-pagination v-model:current-page="selData.page" v-model:page-size="selData.itemsPerPage"
        :page-sizes="[5, 10, 15, 20]" :background="true" layout="jumper, total, sizes, prev, pager, next" :total="total"
        @change="onChange" />
    </div>
    <!-- 添加资讯抽屉 -->
    <el-drawer v-model="isDrawer" title="添加咨询" direction="rtl" v-loading="loadingAdd">
      <!-- 更新图书模块 -->
      <el-form size="large" autocomplete="off" :model="addInforData" :rules="informationRules" ref="ruleFormRef">
        <!-- 表单数据区域 -->
        <el-form-item prop="title" label="标题" label-position="top">
          <el-input placeholder="请输入标题" v-model="addInforData.title"></el-input>
        </el-form-item>
        <!-- 上传区域 -->
        <el-form-item prop="main" label="内容" label-position="top">
          <el-upload class="upload-demo" drag ref="uploadRef" :headers="headers" :auto-upload="false"
            :before-upload="beforeUpload" :on-change="onUploadChange" multiple v-model:file-list="fileList" :limit="1"
            :on-exceed="handleExceed">
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
              拖拽或者 <em>点击上传</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                请上传word文档文件,并且文件大小不超过1G
              </div>
            </template>
          </el-upload>
        </el-form-item>
        <!-- 表单按钮区域 -->
        <el-form-item>
          <el-button class="button" type="primary" auto-insert-space @click="submitForm(ruleFormRef)">
            确认
          </el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
    <!-- 查看资讯内容抽屉 -->
    <el-drawer v-model="isDrawerHtml" title="资讯内容" direction="rtl" size="50%">
      <div v-if="html" v-html="html"></div>
      <div v-else>暂无内容信息</div>
    </el-drawer>
  </pageComponent>
</template>
    
<style scoped></style>