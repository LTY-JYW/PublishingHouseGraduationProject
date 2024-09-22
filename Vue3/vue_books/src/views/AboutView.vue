<script lang="ts" setup>
import { ref } from 'vue'
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

// 上传成功回调
const handleSuccess: UploadProps['onSuccess'] = (response:imgRes, uploadFile) => {
  // imgs.value = response.data.url
  isLoading.value = false
  // imageUrl.value = URL.createObjectURL(uploadFile.raw!)
  ElMessage.success('上传成功')
}

// 失败的回调
const handleError: UploadProps['onError'] = (error) => {
  isLoading.value = false
  ElMessage.error(error.message)
}

// 上传前的回调
const beforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
  isLoading.value = true
  // 修改文件类型检查逻辑
  const allowedTypes = ['image/jpeg', 'image/png','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document']; // 允许的文件类型
  if (!allowedTypes.includes(rawFile.type)) {
    ElMessage.error('文件类型不匹配！')
    return false
  } else if (rawFile.size / 1024 / 1024 > 1024) {
    ElMessage.error('文件大小不能超过1G')
    return false
  }
  return true
}



// 获取html内容
import { getHtmlAPI } from '@/api/uploads'
const html = ref('')
const getHtml = async () => {
  const { data } = await getHtmlAPI('52a0f1aa-18f3-4c50-940d-5a1dc20afd87.docx') 
  html.value = data.data
}
await getHtml()
console.log(html.value);

</script>
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

<div v-html="html"></div>
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
  width: 178px;
  height: 178px;
  display: block;
}
</style>