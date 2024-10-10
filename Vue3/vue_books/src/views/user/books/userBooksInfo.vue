<script lang="ts" setup>
import { ref } from 'vue'
// 导入API
import { booksGetInfoAPI } from '@/api/books'
import { getHtmlAPI } from '@/api/uploads'
import { cartAddAPI } from '@/api/cart'
// 导入API类型
import type { BookInfoType } from '@/api/books'
// 导入公共函数
import { formDate } from '@/utils/dayjs'
// 导入路由
import { useRoute } from 'vue-router'
import router from '@/router'
// 导入pinia
import { useUserStore } from '@/stores/user'
// 导入el图标
import { ShoppingCart, ShoppingBag } from '@element-plus/icons-vue'
// 导入el组件
import { ElMessageBox } from 'element-plus'


const userStore = useUserStore()
const route = useRoute()

const bookId: number = Number(route.query.id)

// 图书详细信息变量
const bookInfo = ref<BookInfoType>([])
// 获取图书详细信息事件函数
const getBookInfo = async () => {
    const { data } = await booksGetInfoAPI(bookId)
    bookInfo.value = data.data
}
await getBookInfo()

// 试读功能
// 存储查看内容的HTML变量
const html = ref<string>()
if (bookInfo.value[0].preview) {
    const { data } = await getHtmlAPI(bookInfo.value[0].preview as string)
    html.value = data.data.html
}

// 立即购买事件函数
const buyNow = async (id: number, fage: boolean) => {
    if (userStore.token && userStore.permissions === 2) {
        if (fage) {
            router.push(`/buyNow?id=${id}`)
        } else {
            await cartAddAPI(id)
        }
    } else {
        ElMessageBox.confirm('请先登录！', '确认登录', {
            confirmButtonText: '去登录',
            cancelButtonText: '取消',
            type: 'warning',
        }).then(async () => {
            // 用户点击确定后的操作
            router.push(`/login`)
        }).catch(() => {
            // 用户点击取消后的操作
        });
    }
}

</script>
<template>
    <div class="box">
        <div> 当前位置：<span>首页</span> >> <span>图书大全</span></div>
        <div class="box-info">
            <img :src="bookInfo[0].cover" alt="">
            <div class="box-info-font">
                <div class="box-info-font-title">{{ bookInfo[0].name }}</div>
                <div class="box-info-font-main">
                    <el-form>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="ID：">{{ bookInfo[0].id }}</el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="作者：">{{ bookInfo[0].uValue }}</el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="出版日期:">{{ formDate(bookInfo[0].time) }}</el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="版次:">{{ bookInfo[0].edition }}</el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="价格:">{{ bookInfo[0].price }}</el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="页数:">{{ bookInfo[0].pages }}</el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="卷数：">{{ bookInfo[0].number }}</el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="主题词：">{{ bookInfo[0].topic }}</el-form-item>
                            </el-col>
                        </el-row>
                        <!-- 操作部分 -->
                        <el-button-group>
                            <el-button type="primary" :icon="ShoppingCart" @click="buyNow(bookId, false)">加入购物车</el-button>
                            <el-button type="danger" :icon="ShoppingBag" @click="buyNow(bookId, true)">立即购买</el-button>
                        </el-button-group>
                    </el-form>
                </div>
            </div>
        </div>
        <div class="box-introduction">
            <div class="box-introduction-book">
                <span>内容简介</span>
                <div class="box-introduction-book-main">
                    {{ bookInfo[0].profile }}
                </div>
            </div>
            <div class="box-introduction-user">
                <span>作者简介</span>
                <div class="box-introduction-user-main">
                    {{ bookInfo[0].uBriefly }}
                </div>
            </div>
        </div>
        <div class="box-preview">
            <span class="box-preview-span">试读</span>
            <div class="box-preview-main" v-html="html" v-if="html"></div>
            <div class="box-preview-main" v-else>
                该图书暂无试读
            </div>
        </div>
    </div>
</template>
    

    
<style lang="scss">
@mixin box-introduction-font {
    font-size: 20px;
    margin-top: 10px;
}

@mixin box-span {
    color: #66ccff;
    font-family: '程荣光刻楷', sans-serif;
    font-size: 30px;
}

.box {
    .box-info {
        display: flex;
        padding: 20px;
        background: white;

        .box-info-font {
            width: 745px;
            margin-left: 30px;
            margin-top: 20px;

            .box-info-font-title {
                font-family: '程荣光刻楷', sans-serif;
                font-weight: bold;
                font-size: 50px;
            }

            .box-info-font-main {
                margin-top: 10px;
                color: #999999;

                .el-form-item__label {
                    font-size: 18px;
                }

                .el-form-item__content {
                    font-size: 18px;
                }

            }


        }

    }

    .box-introduction {
        margin-top: 20px;
        background: white;
        padding: 30px;

        span {
            @include box-span;
        }

        .box-introduction-book {
            margin-bottom: 20px;
            padding-bottom: 20px;
            border-bottom: 1px #999999 solid;

            .box-introduction-book-main {
                @include box-introduction-font;
            }
        }

        .box-introduction-user {
            .box-introduction-user-main {
                @include box-introduction-font;
            }
        }
    }

    .box-preview {
        margin-top: 20px;
        background: white;
        padding: 30px;

        .box-preview-span {
            @include box-span;
        }

        .box-preview-main {
            max-height: 1500px;
            overflow: hidden;
        }
    }
}
</style>