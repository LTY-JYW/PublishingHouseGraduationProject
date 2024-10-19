<script lang="ts" setup>
import { ref } from 'vue'
// 导入API
import { userAuthorAPI, userUpInfoAPI } from '@/api/user'
import { uploadsFileWordAPI } from '@/api/uploads'
// 导入API类型
import type { AuthorType, UserUpInfoType } from '@/api/user'
// 导入默认头像
import { URLAVATAR, URLBG } from '@/utils/default'

// 导入el图标
import { Delete, Search, Edit, Picture } from '@element-plus/icons-vue'
// 导入el类型
import type { FormRules, FormInstance, UploadInstance, UploadProps, UploadFile, UploadRawFile } from 'element-plus'
// 导入el组件
import { ElMessageBox, ElMessage, genFileId } from 'element-plus'

// 抽屉变量
const isDrawer = ref(false)
// 表单变量
const ruleFormRef = ref()

// 表单变量
const submitDocuments = ref<AuthorType>({
    reviewMaterials: ''
})
// 校验变量
const submitDocumentsRules: FormRules<AuthorType> = {
    reviewMaterials: [
        {
            required: true,
            message: '请输入昵称',
            trigger: 'blur'
        }
    ]
}

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
// 确认添加图书事件函数
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate(async (valid, fields) => {
        if (valid) {
            // 触发上传验证文件
            uploadRef.value!.submit()
            if (isOkType.value) {
                // 将文件封装到formData中
                const formData = new FormData()
                formData.append('file', file.value)
                formData.append('flag', "author")
                // 调用上传接口
                const resFile = await uploadsFileWordAPI(formData)
                submitDocuments.value.reviewMaterials = resFile.data.data.url
                // 调用添加接口
                await userAuthorAPI(submitDocuments.value)
            }
        } else {
            ElMessage.error(fields)
        }
    })
}
</script>
<template>
    <div class="box-author">
        <pageComponent title="申请作者">
            <div class="main">
                <el-form size="large" autocomplete="off" label-position="top" :model="submitDocuments"
                    :rules="submitDocumentsRules" ref="ruleFormRef">
                    <!-- 表单数据区域 -->
                    <el-form-item prop="nickname" label="提交材料">
                        <!-- 上传区域 -->
                        <el-upload class="avatar-uploader" :headers="headers" :show-file-list="false"
                            :before-upload="beforeUpload" :on-change="onUploadChange" :on-exceed="handleExceed"
                            :auto-upload="false" :limit="1" ref="uploadRef" v-loading="isLoadingUpload">
                            <el-icon class="avatar-uploader-icon">
                                <Plus />
                            </el-icon>
                        </el-upload>
                    </el-form-item>
                    <!-- 表单按钮区域 -->
                    <el-form-item class="aaa">
                        <el-button class="button" type="primary" auto-insert-space @click="submitForm(ruleFormRef)" round>
                            <el-icon>
                                <Upload />
                            </el-icon>
                            提交
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
        </pageComponent>
    </div>
</template>

    
<style scoped lang="scss">
.box-author {
    width: 64vw;
    height: 83vh;
    .main {
        .avatar-uploader {
            border: 1px dashed black;
            padding: 50px;
            margin: auto;
            width: 5.3vw;
        }

        margin-top: 20px;

        :deep(.el-form-item__label) {
            font-size: 50px;
            width: 11.5vw;
            margin: auto;
            padding-bottom: 80px;
        }

        :deep(.el-form-item__content) {
            font-size: 100px;
        }

        :deep(.el-button--primary) {
            font-size: 50px;
            height: 100px;
            margin-left: auto;
        }


    }
}</style>
