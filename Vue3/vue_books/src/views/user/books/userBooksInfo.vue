<script lang="ts" setup>
import { ref, onMounted } from 'vue'
// 导入API
import { booksGetInfoAPI, booksGetUserBooksAPI } from '@/api/books'
import { getHtmlAPI } from '@/api/uploads'
import { cartAddAPI } from '@/api/cart'
// 导入API类型
import type { BooksResListType, BooksUserType } from '@/api/books'
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
import { Swiper, SwiperSlide } from 'swiper/vue';

// Import Swiper styles
import 'swiper/css';

import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import { FreeMode, Pagination } from 'swiper/modules';
const modules = [FreeMode, Pagination]

const userStore = useUserStore()
const route = useRoute()

const bookId: number = Number(route.query.id)

// 图书详细信息变量
const bookInfo = ref<BooksResListType>([])
// 作者图书变量
const userBooks = ref<BooksUserType>()
// 获取图书详细信息事件函数
const getBookInfo = async () => {
    const { data } = await booksGetInfoAPI(bookId)
    bookInfo.value = data.data
    const res = await booksGetUserBooksAPI(bookInfo.value[0].uid)
    userBooks.value = res.data.data.value
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


// 图书点击事件
const onBooks = (id:number) => {
    router.push(`/booksInfo?id=${id}`)

}

</script>
<template>
    <div class="box">
        <div class="exhibit">
            <div class="exhibit-img">
                <img :src="bookInfo[0].cover" alt="">
            </div>
            <div class="exhibit-introduce">
                <div class="exhibit-introduce-author">作者： {{ bookInfo[0].uValue }}</div>
                <div class="exhibit-introduce-name">{{ bookInfo[0].name }}</div>
                <div class="exhibit-introduce-num">
                    <div>{{ formDate(bookInfo[0].time) }}</div>
                    <div>页数： {{ bookInfo[0].number }}</div>
                    <div>版次： {{ bookInfo[0].edition }}</div>
                </div>
                <div class="exhibit-introduce-introduction">{{ bookInfo[0].profile }}</div>
                <div class="exhibit-introduce-more">
                    <el-icon class="slide-fade ">
                        <Bottom />
                    </el-icon>
                    显示更多
                </div>
                <div class="exhibit-introduce-price">
                    ￥{{ bookInfo[0].price}}
                </div>
                <div class="exhibit-introduce-button">
                    <el-button type="success">
                        <el-icon>
                            <ShoppingCartFull />
                        </el-icon>
                        加入购物车
                    </el-button>
                    <el-button type="primary">
                        <el-icon>
                            <Goods />
                        </el-icon>
                        立即购买
                    </el-button>
                </div>
            </div>
        </div>
        <div class="author">
            <div class="author-info">
                <div class="author-info-name">
                    {{ bookInfo[0].uValue }}
                </div>
                <div class="author-info-briefly">
                    {{ bookInfo[0].uBriefly }}
                </div>
            </div>
            <div class="author-img">
                <img :src="bookInfo[0].uAvatar" alt="">
            </div>
        </div>
        <div class="preview">
            <div class="preview-font">试读内容</div>
            <div v-if="html" class="preview-html" v-html="html"></div>
            <div v-else class="preview-html">暂无试读内容</div>
        </div>
        <div class="books">
            <div class="books-font">
                作者所著书籍
            </div>
            <div class="books-list">
                <swiper :freeMode="true" :modules="modules" :slidesPerView="4" :spaceBetween="30">
                    <swiper-slide class="item mouse" v-for="item in userBooks" :key="item.id" @click="onBooks(item.id)">
                        <img :src="item.cover" alt="">
                        <div class="item-uValue">
                            {{ item.uValue }}
                        </div>
                        <div class="item-name">
                            {{ item.name }}
                        </div>
                    </swiper-slide>
                </swiper>
            </div>
        </div>
    </div>
</template>
    

    
<style scoped lang="scss">
.mouse:hover {
    /* 将鼠标指针变为手形 */
    cursor: pointer;
}


.slide-fade {
    animation: slideFade 2s ease-in-out infinite;
}

@keyframes slideFade {
    0% {
        opacity: 0;
        transform: translateY(0px);
    }

    100% {
        opacity: 1;
        transform: translateY(2px);
    }
}

body {
    background: rgba(250, 250, 247);
}

.box {
    .exhibit {
        display: flex;

        .exhibit-img {
            padding: 220px;
            padding-left: 500px;
            background: rgb(240, 240, 235);

            img {
                width: 20vw;
            }
        }

        .exhibit-introduce {
            padding: 100px;
            background: rgb(250, 250, 247);
            position: relative;

            .exhibit-introduce-author {
                color: rgb(150, 150, 150);
            }

            .exhibit-introduce-name {
                font-size: 40px;
            }

            .exhibit-introduce-num {
                display: flex;

                div {
                    margin: 10px;
                    background: rgb(237, 237, 234);
                    padding: 5px;
                }
            }

            .exhibit-introduce-introduction {
                font-size: 20px;
                line-height: 35px;
                margin-top: 20px;
                margin-bottom: 20px;
            }

            .exhibit-introduce-more {
                font-size: 20px;
            }

            .exhibit-introduce-price{
                color: red;
                margin-top: 8vw;
                font-size: 3vw;
                border-top:1px solid rgba(0, 0, 0, 0.2);
                border-bottom: 1px solid rgba(0, 0, 0, 0.2);
            }

            .exhibit-introduce-button {
                position: absolute;
                bottom: 80px;
                width: 80%;
                display: flex;
                justify-content: space-between;

                .el-button {
                    font-size: 30px;
                    padding: 30px;
                }
            }
        }
    }

    .author {
        display: flex;
        padding: 20px;
        margin-top: 50px;
        max-height: 50vw;
        overflow: hidden;
        justify-content: space-between;

        .author-info {
            position: relative;

            .author-info-name {
                font-family: '程荣光刻楷', sans-serif;
                font-size: 8vw;
            }

            .author-info-briefly {
                position: absolute;
                bottom: 1vw;
                font-size: 30px;
                line-height: 1.5;
            }
        }

        .author-img {
            img {
                width: 40vw;
            }
        }
    }

    .preview {
        margin-top: 5vw;
        padding: 20px;
        max-height: 50vw;
        overflow: hidden;
        .preview-font {
            font-size: 40px;
        }

        .preview-html {
            border-top: 1px solid black;
            border-bottom: 1px solid black;
            font-size: 20px;
            line-height: 1.5;
            margin-top: 20px;
            padding-top: 10px;
            padding-bottom: 30px;
        }
    }

    .books {
        .books-font {
            font-size: 40px;
        }

        .books-list {
            width: 100vw;
            // display: flex;

            .item {
                padding: 5vw;
                padding-bottom: 0px;
                margin: 10px;
                background: rgb(240, 240, 235);
                width: auto !important;
                img{
                    width: 15vw;
                    height: 20vw;
                }

                .item-uValue {
                    font-size: 18px;
                    margin-top: 10px;
                }

                .item-name {
                    font-size: 20px;
                    margin: 10px;
                }
            }
        }
    }
}
</style>