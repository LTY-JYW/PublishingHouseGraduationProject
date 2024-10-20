<script lang="ts" setup>
import { ref } from 'vue'
// 导入API
import { userGetInfoAPI, userUpInfoAPI } from '@/api/user'
import { uploadsFileAPI } from '@/api/uploads'
// 导入API类型
import type { UserInfoType, UserUpInfoType } from '@/api/user'
// 导入默认头像
import { URLAVATAR, URLBG } from '@/utils/default'

// 导入el图标
import { Delete, Search, Edit, Picture } from '@element-plus/icons-vue'
// 导入el类型
import type { FormRules, FormInstance, UploadInstance, UploadProps, UploadFile, UploadRawFile } from 'element-plus'
// 导入el组件
import { ElMessageBox, ElMessage, genFileId } from 'element-plus'


// 用户详细信息变量
const userInfo = ref<UserInfoType>()
// 获取用户详细信息变量
const getInfo = async () => {
    const { data: { data } } = await userGetInfoAPI()
    userInfo.value = data
}
await getInfo()

// 抽屉变量
const isDrawer = ref(false)
// 表单变量
const ruleFormRef = ref()
// 用户修改表单变量
const userFormData = ref<UserUpInfoType>({
    nickname: userInfo.value![0].nickname,
    email: userInfo.value![0].email,
    briefly: userInfo.value![0].briefly,
    avatar: userInfo.value![0].avatar,
    phoneNumber: userInfo.value![0].phoneNumber
})
// 用户修改表单校验
const userFormRules: FormRules<UserUpInfoType> = {
    nickname: [
        {
            required: true,
            message: '请输入昵称',
            trigger: 'blur'
        },
        {
            max: 16,
            message: '昵称在1-16给字符范围类',
            trigger: 'blur'
        },
        {
            min: 1,
            message: '昵称在1-16给字符范围类',
            trigger: 'blur'
        }
    ],
    phoneNumber: [

        { required: true, message: '请输入手机号', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }

    ],
    email: [
        {
            required: true,
            message: '请输入昵称',
            trigger: 'blur'
        },
        {
            type: 'email',
            message: '请输入正确的邮箱格式',
            trigger: 'blur'
        }
    ],
    avatar: [
        {
            required: true,
            message: '请选择头像',
            trigger: 'blur'
        },
    ],
    briefly: [
        {
            required: true,
            message: '请输入简介',
            trigger: 'blur'
        },
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
    if (rawFile.type.startsWith('image/')) {
        console.log('是图');

    }
    if (!rawFile.type.startsWith('image/')) {
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
                formData.append('flag', "avatar")
                // 调用上传接口
                const resFile = await uploadsFileAPI(formData)
                userFormData.value.avatar = resFile.data.data.url
                // 调用添加接口
                await userUpInfoAPI(userFormData.value)
            }
        } else {
            ElMessage.error(fields)
        }
    })
    await getInfo()
    isDrawer.value = false
}
</script>
<template>
    <div class="box-userIndex">
        <pageComponent title="个人信息">
            <template #button>
                <el-button plain type="primary" round @click="isDrawer = true">操作</el-button>
            </template>
            <div class="main">
                <el-form :model="userInfo" label-width="auto" style="margin: auto;">
                    <el-form-item label="头像：">
                    </el-form-item>
                    <el-form-item>
                        <el-avatar v-if="userInfo![0].avatar" :size="200" :src="userInfo![0].avatar" />
                        <el-avatar v-else :size="200" :src="URLAVATAR" />
                    </el-form-item>
                    <el-form-item label="账号：">
                    </el-form-item>
                    <el-form-item>
                        <div class="username">{{ userInfo![0].username }}</div>
                    </el-form-item>
                    <el-form-item label="昵称：">
                    </el-form-item>
                    <el-form-item>
                        <div>{{ userInfo![0].nickname }}</div>
                    </el-form-item>
                    <el-form-item label="邮箱：">
                    </el-form-item>
                    <el-form-item>
                        <div style="display: block; width: 250px;">{{ userInfo![0].email }}</div>

                    </el-form-item>
                    <el-form-item label="简介：">
                    </el-form-item>
                    <el-form-item>
                        <div>{{ userInfo![0].briefly }}</div>
                    </el-form-item>
                    <el-form-item label="身份：">
                    </el-form-item>
                    <el-form-item>
                        <el-tag v-if="userInfo![0].isAuthor == 1" type="primary" effect="dark" round>作者</el-tag>
                        <el-tag v-else-if="userInfo![0].isAuthor == 0" type="success" effect="dark" round>普通用户</el-tag>
                        <el-tag v-else type="warning" effect="dark" round>审核中</el-tag>
                    </el-form-item>
                </el-form>
            </div>
        </pageComponent>
        <!-- 修改图书信息抽屉 -->
        <el-drawer v-model="isDrawer" title="更新用户详细信息" direction="rtl">
            <!-- 更新图书模块 -->
            <el-form size="large" autocomplete="off" :model="userFormData" :rules="userFormRules" ref="ruleFormRef">
                <!-- 表单数据区域 -->
                <el-form-item prop="nickname" label="头像">
                    <!-- 上传区域 -->
                    <el-upload class="avatar-uploader" :headers="headers" :show-file-list="false"
                        :before-upload="beforeUpload" :on-change="onUploadChange" :on-exceed="handleExceed"
                        :auto-upload="false" :limit="1" ref="uploadRef" v-loading="isLoadingUpload">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                        <el-icon v-else class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                    </el-upload>
                </el-form-item>
                <el-form-item prop="nickname" label="昵称">
                    <el-input placeholder="请输入昵称" v-model="userFormData.nickname"></el-input>
                </el-form-item>
                <el-form-item prop="phoneNumber" label="联系方式">
                    <el-input placeholder="请输入邮箱" v-model="userFormData.phoneNumber"></el-input>
                </el-form-item>
                <el-form-item prop="nickname" label="邮箱">
                    <el-input placeholder="请输入邮箱" v-model="userFormData.email"></el-input>
                </el-form-item>
                <el-form-item prop="nickname" label="简介">
                    <el-input placeholder="请输入简介" v-model="userFormData.briefly" type="textarea"></el-input>
                </el-form-item>
                <!-- 表单按钮区域 -->
                <el-form-item>
                    <el-button class="button" type="primary" auto-insert-space @click="submitForm(ruleFormRef)">
                        确认
                    </el-button>
                </el-form-item>
            </el-form>
        </el-drawer>
    </div>
</template>

    
<style scoped lang="scss">
:deep(.el-tag) {
    font-size: 50px;
    width: 150px;
    height: 100px;
}

.avatar {
    width: 20vw;
}

.avatar-uploader-icon {
    font-size: 100px;
    margin-left: 20px;
    border: 1px dashed black;
    padding: 30px;
}

.box-userIndex {
    width: 64vw;
    padding: 0;
    margin-left: 15px;

    .main {
        .el-form {
            display: flex;
            flex-wrap: wrap;

            .username {
                min-width: 200px;
            }

            .el-form-item {
                padding: 40px;
                padding-right: 0px;
                padding-left: 20px;
                text-align: center;
                align-items: center;
                border: 1px solid black;
                background: rgb(250, 250, 250);
                margin: 0;
                width: 250px;
                word-wrap: break-word;
                overflow-wrap: break-word;

                :deep(.el-form-item__label) {
                    text-align: center;
                    align-items: center;
                    font-size: 50px;
                    width: 120px;
                    height: 120px;
                    padding: 10px;
                }

                :deep(.el-form-item__content) {
                    text-align: center;
                    align-items: center;
                    margin-left: 50px;
                    font-size: 30px;
                    min-width: 250px;
                    word-wrap: break-word;
                    overflow-wrap: break-word;
                }
            }
        }
    }
}
</style>
