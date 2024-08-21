<template>
  <el-upload
    class="avatar-uploader"
    action="http://127.0.0.1/api/uploads/upload"
    :headers="headers"
    :show-file-list="false"
    :on-success="handleSuccess"
    :on-error="handleError"
    :before-upload="beforeUpload"
    v-loading="isLoading"
  >
    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
  </el-upload>
<img :src="imgs" alt="" style="width: 100px;height: 100px;">
</template>

<script lang="ts" setup>import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { UploadProps } from 'element-plus'
type imgRes = {
  data:{
    url:string
  },
  message:string,
  status:number
}
const isLoading = ref(false)
const imageUrl = ref('')
const imgs = ref('')

const headers = {
  'X-Requested-With': 'XMLHttpRequest',
  'Custom-Header': 'SomeValue',
}

const handleSuccess: UploadProps['onSuccess'] = (response:imgRes, uploadFile, uploadFiles) => {
  console.log(response);
  console.log(uploadFile);
  console.log(uploadFiles);
  imgs.value = response.data.url
  isLoading.value = false
  imageUrl.value = URL.createObjectURL(uploadFile.raw!)
  ElMessage.success('File uploaded successfully.')
}

const handleError: UploadProps['onError'] = (error) => {
  isLoading.value = false
  ElMessage.error('Failed to upload the file.')
  console.error('Upload error:', error);
}

const beforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
  isLoading.value = true
  console.log('Before upload:', rawFile);

  // 修改文件类型检查逻辑
  const allowedTypes = ['image/jpeg', 'image/png']; // 允许的文件类型
  if (!allowedTypes.includes(rawFile.type)) {
    ElMessage.error('The file must be a JPG or PNG image!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('The file size cannot exceed 2MB!')
    return false
  }
  return true
}
</script>

<style scoped>.avatar-uploader .el-upload {
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
  width: 178px;
  height: 178px;
  display: block;
}
</style>