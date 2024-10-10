<script lang="ts" setup>
import { ref } from 'vue'
// 导入API
import { category2ListAPI, category2DeleteAPI, category2AddAPI, category2UpdataAPI } from '@/api/category2'
import { categoryNameAPI } from '@/api/category'
import { uploadsFileAPI } from '@/api/uploads'
// 导入API类型
import type { Category2ListType, Category2AddType } from '@/api/category2'
import type { CategoryNameType } from '@/api/category'
import type { PageType } from '@/api/results'


// 导入公共函数
import { lastPage } from '@/utils/funtion'

// 导入el图标
import { Delete, Search, Edit, Picture } from '@element-plus/icons-vue'
// 导入el类型
import type { FormRules, FormInstance, UploadInstance, UploadProps, UploadFile, UploadRawFile } from 'element-plus'
// 导入el组件
import { ElMessageBox, ElMessage, genFileId } from 'element-plus'


//控制加载状态变量
const loading = ref(false)
// 表格数据
const tableData = ref<Category2ListType>()
// 接口返回数据的总条数
const total = ref<number>(0)
// 查询资讯信息提交数据变量
const selData = ref<PageType>({
  page: 1,
  itemsPerPage: 5
})
// 一级分类名变量
const categoryName = ref<CategoryNameType>()
// 获取一级分类名函数
const getCategoryName = async () => {
  const { data } = await categoryNameAPI()
  categoryName.value = data.data
}
// 一开始便调用函数获取一级分类名
await getCategoryName()

// 获取资讯列表函数
const getList = async () => {
  loading.value = true
  const { data } = await category2ListAPI(selData.value)
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
// 一级分类搜索变量
const searchCid = ref<number>()
// 搜索框变量
const searchData = ref('')
//  搜索事件函数
const onSearchChange = async () => {
  await getList()
  if (searchCid.value && searchData.value) {
    return tableData.value = tableData.value?.filter((item) => item.name.includes(searchData.value) && item.cid === searchCid.value)
  }
  if (searchCid.value) {
    return tableData.value = tableData.value?.filter((item) => item.cid === searchCid.value)
  }
  if (searchData.value) {
    return tableData.value = tableData.value?.filter((item) => item.name.includes(searchData.value))
  }
}
// 一级分类选择器清空事件函数
const onCidClear = async () => {
  searchCid.value = undefined
  await onSearchChange()
}
// 搜索框清除图标事件函数
const onNameClear = async () => {
  searchData.value = ''
  await onSearchChange()
}
// 重置按钮事件函数
const onClear = async () => {
  searchData.value = ''
  searchCid.value = undefined
  await getList()
}

// 表格操作部分
// 判断为添加还是编辑变量
const isAdd = ref<boolean>()
// 控制抽屉显示隐藏变量
const isDrawer = ref(false)
// 修改分类的id变量
const updataId = ref(0)
// 修改分类回显数据类型
type CategoryUpType = {
  id: number
  cid: string
  name: string
  profile: string
  cover: string
}
// 修改二级分类事件函数
const headEdit = (data: CategoryUpType) => {
  const { id, cid, name, profile, cover } = data
  isAdd.value = false
  isDrawer.value = true
  updataId.value = id
  addCategoryData.value = {
    cid: cid.toString(),
    name,
    profile,
    cover
  }
  imageUrl.value = data.cover
}
// 删除二级分类时间函数
const headDelete = async (id: number) => {
  ElMessageBox.confirm('你确定要删除吗？', '确认对话框', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    // 用户点击确定后的操作
    loading.value = true
    await category2DeleteAPI(id)
    loading.value = false
    await getList()
  }).catch(() => {
    // 用户点击取消后的操作
  });
}

// 添加分类按钮点击事件函数
const onAddCategory2 = () => {
  isDrawer.value = true
  isAdd.value = true
  addCategoryData.value = {
    cid: '请选择',
    name: '',
    profile: '',
    cover: ''
  }
  imageUrl.value = undefined
}

// 添加二级分类
// 二级分类添加表单变量
const addCategoryData = ref<Category2AddType>({
  cid: '0',
  name: '',
  profile: '',
  cover: ''
})
// 添加二级分类校验变量
const addCategoryRules: FormRules<Category2AddType> = {
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
// 显示图片地址变量
const imageUrl = ref()
// 校验类型变量
const isOkType = ref(false)
// 上传加载变量
const isLoadingUpload = ref(false)
// 上传文件改变时的事件函数
const onUploadChange = (uploadFile: UploadFile) => {
  file.value = uploadFile.raw ? uploadFile.raw : initialFile
  if (uploadFile.raw) {
    // 使用 FileReader 读取文件
    const reader = new FileReader();
    reader.onload = (event) => {
      // 获取读取的 URL
      const fileUrl = event.target?.result as string;
      // 将文件 URL 设置到响应式变量中
      imageUrl.value = fileUrl;
    };
    // 读取文件
    reader.readAsDataURL(uploadFile.raw);
  } else {
    // 如果上传的文件不是图片，设置 URL 为空
    imageUrl.value = '';
  }
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
  const allowedTypes = ['image/png', 'image/jpg'];
  if (rawFile.type.startsWith('image/')) {
    console.log('是图');

  }
  if (!allowedTypes.includes(rawFile.type)) {
    ElMessage.error('文件类型不匹配！')
  } else if (rawFile.size / 1024 / 1024 > 1024) {
    ElMessage.error('文件大小不能超过1G')
  } else {
    isOkType.value = true
  }
  return false
}
// 确认添加图书事件函数
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      // 触发上传验证文件
      uploadRef.value!.submit()
      if (isOkType.value) {
        // 将文件封装到formData中
        const formData = new FormData();
        formData.append('file', file.value);
        // 调用上传接口
        const resFile = await uploadsFileAPI(formData)
        addCategoryData.value.cover = resFile.data.data.url
        // 判断为添加还是修改
        if (isAdd.value) {
          // 调用添加接口
          await category2AddAPI(addCategoryData.value)

          selData.value.page = lastPage(total.value, selData.value.itemsPerPage)
        } else {
          await category2UpdataAPI({
            ...addCategoryData.value,
            id: updataId.value
          })
        }
      }
    } else {
      ElMessage.error(fields)
    }
  })
  await getList()
  isDrawer.value = false
}
</script>
<template>
  <pageComponent title="二级分类管理">
    <!-- 添加分类插槽 -->
    <template #button>
      <el-button plain type="primary" round @click="onAddCategory2">添加分类</el-button>
    </template>
    <!-- 搜索表单部分 -->
    <el-form :inline="true">
      <!--  所属一级分类搜索 -->
      <el-form-item label="所属一级分类">
        <el-select style="width: 200px" v-model="searchCid" @change="onSearchChange" clearable @clear="onCidClear">
          <el-option v-for="item in categoryName" :key="item.id" :value="item.id" :label="item.name"></el-option>
        </el-select>
      </el-form-item>
      <!-- 分类名搜索 -->
      <el-form-item>
        <el-input v-model="searchData" style="width: 250px" placeholder="请输入想搜索分类名" clearable :suffix-icon="Search"
          @clear="onNameClear" />
        <el-button type="primary" :icon="Search" @click="onSearchChange">搜索</el-button>
        <el-button @click="onClear">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格部分 -->
    <el-table stripe style="width: 100%" :data="tableData" v-loading="loading" height="680" table-layout="auto">
      <el-table-column label="封面" width="180">
        <template #default="scope">
          <el-image v-if="scope.row.cover" style="width: 100px; height: 100px" :src="scope.row.cover" />
          <div v-else>
            <el-icon>
              <Picture />
            </el-icon>
            <div>图片加载失败！</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="分类名" />
      <el-table-column prop="profile" label="简介" />
      <el-table-column prop="cValue" label="所属一级分类" />
      <!-- 表格操作部分 -->
      <el-table-column label="操作" class="table_operation" width="50px">
        <template #default="scope">
          <el-button-group>
            <el-button type="primary" :icon="Edit" circle plain @click="headEdit(scope.row)"
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
    <el-drawer v-model="isDrawer" :title="isAdd ? '添加分类' : '编辑分类'" direction="rtl">
      <!-- 更新图书模块 -->
      <el-form size="large" autocomplete="off" :model="addCategoryData" :rules="addCategoryRules" ref="ruleFormRef">
        <!-- 表单数据区域 -->
        <el-form-item prop="main" label="内容" label-position="top">
          <!-- 上传区域 -->
          <el-upload class="avatar-uploader" :headers="headers" :show-file-list="false" :before-upload="beforeUpload"
            :on-change="onUploadChange" :on-exceed="handleExceed" :auto-upload="false" :limit="1" ref="uploadRef"
            v-loading="isLoadingUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="分类" label-position="top">
          <el-select style="width: 200px" v-model="addCategoryData.cid" clearable>
            <el-option v-for="item in categoryName" :key="item.id" :value="item.id" :label="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="title" label="分类名" label-position="top">
          <el-input placeholder="请输入分类名" v-model="addCategoryData.name"></el-input>
        </el-form-item>
        <el-form-item prop="main" label="简介" label-position="top">
          <el-input placeholder="请输入简介" v-model="addCategoryData.profile"></el-input>
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