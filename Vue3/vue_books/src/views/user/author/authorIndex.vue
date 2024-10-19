<script lang="ts" setup>
import { ref } from 'vue'
// 导入Swiper
import { Swiper, SwiperSlide } from 'swiper/vue';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import { FreeMode, Pagination } from 'swiper/modules';

// 导入API
import { userGetInfoAdminAPI } from '@/api/user'
import { booksGetUserBooksAPI } from '@/api/books'
// 导入API类型
import type { UserInfoType } from '@/api/user'
import type { BooksUserType } from '@/api/books'
// 导入路由
import { useRoute } from 'vue-router'
import router from '@/router'

const route = useRoute()
// 图书Id
const id: number = Number(route.query.id)

// 配置swiper
const modules = [FreeMode, Pagination]

// 作者详细信息变量
const userInfo = ref<UserInfoType>()
// 作者图书列表变量
const userBooksList = ref<BooksUserType>()
// 获取作者详细信息和图书列表函数
const getInfo = async () => {
    const { data: { data } } = await userGetInfoAdminAPI(id)
    userInfo.value = data
    const res = await booksGetUserBooksAPI(id)
    userBooksList.value = res.data.data.value
}
await getInfo()

// 点击图书函数
const onBooks = (id: number) => {
    router.push(`/booksInfo?id=${id}`)
}



</script>
<template>
    <div>
        <div class="info">
            <div class="info-basicInformation">
                <div class="info-basicInformation-name">
                    {{ userInfo![0].nickname }}
                </div>
                <div class="info-basicInformation-introduction">
                    {{ userInfo![0].briefly }}
                </div>
            </div>
            <div class="info-img">
                <img :src="userInfo![0].avatar" alt="">
            </div>
        </div>
        <div class="books-font">
                作者所著书籍
            </div>
        <div class="books-list">
            <swiper :freeMode="true" :modules="modules" :slidesPerView="4" :spaceBetween="30">
                <swiper-slide class="item mouse" v-for="item in userBooksList" :key="item.id" @click="onBooks(item.id)">
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
</template>
    

    
<style scoped lang="scss">
.mouse:hover {
    /* 将鼠标指针变为手形 */
    cursor: pointer;
}

body {
    background: rgb(250, 250, 247);
}

.info {
    display: flex;
    padding-top: 150px;
    justify-content: space-between;

    .info-basicInformation {
        padding: 3vw;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .info-basicInformation-name {
            font-size: 6vw;
            font-family: '程荣光刻楷', sans-serif;
        }

        .info-basicInformation-introduction {
            font-size: 2vw;
            padding-bottom: 1vw;
            line-height: 1.6;
        }
    }

    .info-img {
        padding: 3vw;

        img {
            height: 50vw;

        }
    }
}

.books-font{
    margin-top: 3vw;
    font-size: 50px;
    padding: 20px;
}

.books-list {
    width: 100vw;
    display: flex;
    padding: 20px;
    .item {
        padding: 5vw;
        padding-bottom: 0px;
        margin: 10px;
        background: rgb(240, 240, 235);
        width: auto !important;

        .item-uValue {
            font-size: 18px;
            margin-top: 10px;
        }

        .item-name {
            font-size: 20px;
            margin: 10px;
        }
    }
}</style>