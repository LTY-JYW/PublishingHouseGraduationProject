<script lang="ts" setup>
import { ref } from 'vue'
// 导入API
import { adminGetInfoApi, adminUpAvatarAPI } from '@/api/admin'
import { auditGetInfo,auditUpAvatarAPI } from '@/api/audit'
import { uploadsFileAPI } from '@/api/uploads'
// 导入API类型
import type { AdminGetInfoType } from '@/api/admin'
// 导入el组件
import { genFileId, ElMessage } from 'element-plus'
// 导入el类型
import type { UploadInstance, UploadProps, UploadFile, UploadRawFile } from 'element-plus'
// 导入默认头像
import { URLAVATAR } from '@/utils/default'
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

// 管理员详细信息变量
const adminInfoData = ref<AdminGetInfoType>([{
  id: 1,
  username: '',
  nickname: '',
  avatar: ''
}])

// 获取管理员详细信息函数
const getAdminInfo = async () => {
  if (isAdmin.value) {
    const { data } = await adminGetInfoApi()
    adminInfoData.value = data.data
  }else{
    const { data } = await auditGetInfo()
    adminInfoData.value = data.data
  }

}
// 调用函数获取管理员详细信息
await getAdminInfo()
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
  if (rawFile.type.startsWith('image/*')) {
    console.log('aaaaaa');
    
    ElMessage.error('文件类型不匹配！')
    return false
  }
  if (rawFile.size / 1024 / 1024 > 1024) {
    ElMessage.error('文件大小不能超过1G')
    return false
  } else {
    isOkType.value = true
  }
  return false
}
// 确认添加图书事件函数
const submitForm = async () => {
  uploadRef.value!.submit()
  if (isOkType.value) {
    // 将文件封装到formData中
    const formData = new FormData();
    formData.append('file', file.value);
    // 调用上传接口
    const resFile = await uploadsFileAPI(formData)
    imageUrl.value = resFile.data.data.url
    // 调用添加接口
    if(isAdmin.value){
      await adminUpAvatarAPI({ avatar: imageUrl.value })
    }else{
      await auditUpAvatarAPI(imageUrl.value)
    }
    await getAdminInfo()
  }
  window.location.reload();
}

// 清除事件函数
const clearForm = async () => {
  imageUrl.value = ''
  await getAdminInfo()
}

</script>
<template>
  <pageComponent title="修改头像">
    <el-row justify="center" class="elRowS">
      <el-col :span="3" :offset="0">
        <el-upload class="avatar-uploader" :headers="headers" :show-file-list="false" :before-upload="beforeUpload"
          :on-change="onUploadChange" :on-exceed="handleExceed" :auto-upload="false" :limit="1" ref="uploadRef"
          v-loading="isLoadingUpload">
          <el-avatar class="avatar" :size="200" :src="imageUrl ? imageUrl : adminInfoData[0].avatar?adminInfoData[0].avatar:URLAVATAR" />
        </el-upload>
        <div class="el-button-admin-form">
          <el-button class="button" type="primary" auto-insert-space @click="submitForm()">
            确认
          </el-button>
          <el-button class="button" type="info" auto-insert-space @click="clearForm()">
            重置
          </el-button>
        </div>
      </el-col>
    </el-row>




  </pageComponent>
</template>
    
<style scoped>
.el-row {
  margin-top: 50px;
}

.el-button-admin-form {
  margin: auto;
  margin-top: 50px;
  width: 100%;
  justify-content: space-between;
}

.el-button--info {
  float: right;
}
</style>