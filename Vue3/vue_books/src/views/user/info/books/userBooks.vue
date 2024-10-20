<script lang="ts" setup>
import { ref } from 'vue'
// 导入API
import { booksGetUserBooksNoAPI, booksAddAPI } from '@/api/books'
import { category2NameAPI } from '@/api/category2'
import { uploadsFileWordAPI, getHtmlAPI,uploadsFileAPI } from '@/api/uploads'
// 导入API类型
import type { BooksUserType, BookAddType } from '@/api/books'
import type { PageType } from '@/api/results'
import type { CategoryNameType } from '@/api/category'
// 导入默认头像
import { URLAVATAR, URLBG } from '@/utils/default'
// 导入el图标
import { Delete, Edit, } from '@element-plus/icons-vue'
// 导入el类型
import type { FormRules, FormInstance, UploadInstance, UploadProps, UploadFile, UploadUserFile, UploadRawFile } from 'element-plus'
// 导入el组件
import { ElMessageBox, ElMessage, genFileId } from 'element-plus'
// 导入公共函数
import { formDate } from '@/utils/dayjs'
import { onOrder } from '@/utils/funtion'
// 导入地区数据
import data from '@/assets/json.json'
// 导入Swiper
import { Swiper, SwiperSlide } from 'swiper/vue';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import { FreeMode, Pagination } from 'swiper/modules';
// 导入公共函数
import { onBooks } from '@/utils/funtion'

// 配置swiper
const modules = [FreeMode, Pagination]
// 空遍历
const isNull = ref(false)
// 加载变量
const loading = ref(true)
// 分页变量
const page = ref<PageType>({
    page: 1,
    itemsPerPage: 5
})
// 订单列表变量
const bookList = ref<BooksUserType>()
// 总数变量
const count = ref<number>()
// 获取订单列表函数
const getList = async () => {
    const { data: { data } } = await booksGetUserBooksNoAPI()
    if (data.value.length < 1) {
        isNull.value = true
    }
    bookList.value = data.value
    count.value = data.count
    loading.value = false
}
await getList()

// 文章分类名变量
const category2Name = ref<CategoryNameType>()
// 文章分类列表函数
const getCategoryName = async () => {
    const { data } = await category2NameAPI()
    category2Name.value = data.data
}
// 一开始调用函数获取分类名
await getCategoryName()

// 抽屉变量
const isDrawer = ref(false)
// 修改图书信息校验规则
const booksRules: FormRules<BookAddType> = {
    cid: [
        {
            required: true,
            message: '请选择分类',
            trigger: 'blur'
        }
    ],
    name: [
        {
            required: true,
            message: '请输入书籍名称',
            trigger: 'blur'
        }
    ],
    profile: [
        {
            required: true,
            message: '请输入书籍名称',
            trigger: 'blur'
        }
    ],
    edition: [
        {
            required: true,
            message: '请输入书籍名称',
            trigger: 'blur'
        }
    ],
}
// 修改图书信息变量
const booksDate = ref<BookAddType>({
    cid: undefined,
    name: '',
    profile: '',
    edition: undefined,
    price: undefined,
    pages: undefined,
    cover: '',
    preview: ''
})

// 添加图书按钮事件
const onAddBook = () => {
    isDrawer.value = true
}

// 获取表单数据变量
const ruleFormRef = ref<FormInstance>()
// 请求头
const headers = {
    'Content-Type': 'multipart/form-data',
}
// 上传文件变量
const uploadRef = ref<UploadInstance>()
const uploadRefImg = ref<UploadInstance>()
// 创建一个空的 File 对象作为初始值
const emptyFileBlob = new Blob([''], { type: 'text/plain' });
const emptyFileName = 'empty.txt';
const initialFile = new File([emptyFileBlob], emptyFileName);
// 保存要上传的文件的变量
const file = ref<File>(initialFile)
const fileImg = ref<File>(initialFile)
// 文件列表图标常量
const url = 'https://element-plus.org/images/element-plus-logo.svg'
// 上传文件列变量
const fileList = ref<UploadUserFile[]>()
const fileListImg = ref<UploadUserFile[]>()
// 校验类型变量
const isOkType = ref(false)
const isOkTypeImg = ref(false)
// 添加加载变量
const loadingAdd = ref(false)
// 上传文件改变时的事件函数
const onUploadChange = (uploadFile: UploadFile) => {
    fileList.value = [{ name: uploadFile.name, url }]
    file.value = uploadFile.raw ? uploadFile.raw : initialFile
}
// 上传文件改变时的事件函数
const onUploadChangeImg = (uploadFile: UploadFile) => {
    fileListImg.value = [{ name: uploadFile.name, url }]
    fileImg.value = uploadFile.raw ? uploadFile.raw : initialFile
}
// 重复选择文件时的事件函数
const handleExceed: UploadProps['onExceed'] = (files) => {
    uploadRef.value!.clearFiles()
    const file = files[0] as UploadRawFile
    file.uid = genFileId()
    uploadRef.value!.handleStart(file)
}
const handleExceedImg: UploadProps['onExceed'] = (files) => {
    uploadRefImg.value!.clearFiles()
    const file = files[0] as UploadRawFile
    file.uid = genFileId()
    uploadRefImg.value!.handleStart(file)
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
// 上传文件前的校验事件函数
const beforeUploadImg: UploadProps['beforeUpload'] = (rawFile) => {
    // 修改文件类型检查逻辑
    // 允许的文件类型
    // const allowedTypes = ['image/png', 'image/jpg'];
    if (rawFile.type.startsWith('image/')) {
        console.log('是图');

    }
    if (!rawFile.type.startsWith('image/')) {
        ElMessage.error('文件类型不匹配！')
    } else if (rawFile.size / 1024 / 1024 > 1024) {
        ElMessage.error('文件大小不能超过1G')
    } else {
        isOkTypeImg.value = true
    }
    return false
}

// 确认添加资讯事件函数
const submitForm = async (formEl: FormInstance | undefined) => {
    console.log(booksDate.value);
    if (!formEl) return
    await formEl.validate(async (valid, fields) => {
        if (valid) {
            loadingAdd.value = true
            // 触发上传验证文件
            uploadRef.value!.submit()
            uploadRefImg.value!.submit()
            if (isOkType.value && isOkTypeImg.value) {
                // 将文件封装到formData中
                const formData = new FormData()
                const formDataImg = new FormData()
                formData.append('file', file.value);
                formData.append('flag', 'word');
                formDataImg.append('flag', "information")
                formDataImg.append('file', fileImg.value)
                // 调用上传接口
                const resFile = await uploadsFileWordAPI(formData)
                const resFileImg = await uploadsFileAPI(formDataImg)
                // 调用添加接口
                booksDate.value.preview = resFile.data.data.url
                booksDate.value.cover = resFileImg.data.data.url
                console.log(booksDate.value);
                
                await booksAddAPI(booksDate.value)
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
</script>
<template>
    <div class="box-book">
        <pageComponent title="图书管理">
            <template #button>
                <el-button plain type="primary" round @click="onAddBook">添加图书</el-button>
            </template>
            <div class="font">我的图书：</div>
            <swiper :freeMode="true" :modules="modules" :slidesPerView="4" :spaceBetween="30">
                <swiper-slide class="item mouse" v-for="item in bookList" :key="item.id" @click="onBooks(item.id)">
                    <img :src="item.cover" alt="">
                    <div class="item-uValue">
                        {{ item.uValue }}
                    </div>
                    <div class="item-name">
                        {{ item.name }}
                    </div>
                </swiper-slide>
            </swiper>
        </pageComponent>
        <!-- 添加图书信息抽屉 -->
        <el-drawer v-model="isDrawer" title="添加图书" direction="rtl">
            <!-- 更新图书模块 -->
            <el-form size="large" autocomplete="off" :model="booksDate" :rules="booksRules" ref="ruleFormRef">
                <!-- 表单数据区域 -->
                <!-- 上传区域cover -->
                <el-form-item prop="cover" label="封面" label-position="top">
                    <el-upload class="upload-demo" drag ref="uploadRefImg" :headers="headers" :auto-upload="false"
                        :before-upload="beforeUploadImg" :on-change="onUploadChangeImg" multiple
                        v-model:file-list="fileListImg" :limit="1" :on-exceed="handleExceedImg">
                        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                        <div class="el-upload__text">
                            拖拽或者 <em>点击上传</em>
                        </div>
                        <template #tip>
                            <div class="el-upload__tip">
                                请上传图片文件,并且文件大小不超过5m
                            </div>
                        </template>
                    </el-upload>
                </el-form-item>
                <!-- 上传区域word -->
                <el-form-item prop="main" label="试读" label-position="top">
                    <el-upload class="upload-demo" drag ref="uploadRef" :headers="headers" :auto-upload="false"
                        :before-upload="beforeUpload" :on-change="onUploadChange" multiple v-model:file-list="fileList"
                        :limit="1" :on-exceed="handleExceed">
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
                <el-form-item prop="name" label="书名">
                    <el-input placeholder="请输入书名" v-model="booksDate.name"></el-input>
                </el-form-item>
                <el-form-item prop="profile" label="简介">
                    <el-input placeholder="请输入简介"  type="textarea" v-model="booksDate.profile"></el-input>
                </el-form-item>
                <el-form-item label="版号">
                    <el-input-number v-model="booksDate.edition" :min="1" :max="100"/>
                </el-form-item>
                <el-form-item label="页数">
                    <el-input-number v-model="booksDate.pages" :min="1" :max="100"/>
                </el-form-item>
                <el-form-item label="价格">
                    <el-input-number v-model="booksDate.price" :min="1" :max="100"/>
                </el-form-item>
                <el-form-item label="分类">
                    <el-select style="width: 200px" v-model="booksDate.cid" prop="cid">
                        <el-option v-for="item in category2Name" :key="item.id" :value="item.id"
                            :label="item.name"></el-option>
                    </el-select>
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
.mouse:hover {
    /* 将鼠标指针变为手形 */
    cursor: pointer;
}

.box-book {
    width: 64vw;
    height: 83vh;

    .font {
        font-size: 40px;
        margin-bottom: 20px;
    }
}
img{
    width: 15w;
    height: 20vw;
}
</style>
