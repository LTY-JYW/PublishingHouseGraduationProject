<script lang="ts" setup>
import { ref } from 'vue'
// 导入API
import { booksGetListNoPageAPI } from '@/api/books'
import { informationApprovedGetListAPI } from '@/api/information'
import { category2ListAPI } from '@/api/category2'
// 导入API类型
import type { BooksResListType } from '@/api/books'
import type { InformationType } from '@/api/information'
import type { PageByType } from '@/api/results'
import type { Category2ListType } from '@/api/category2'
// 导入路由
import router from '@/router'


// 图书信息宣传变量
const bookList = ref([
    {
        id: 1,
        cover: 'http://al.ltyjyw.site/assets/Slideshow/books/books-1.jpeg'
    },
    {
        id: 2,
        cover: 'http://al.ltyjyw.site/assets/Slideshow/books/books-2.jpeg'
    },
    {
        id: 3,
        cover: 'http://al.ltyjyw.site/assets/Slideshow/books/books-3.jpeg'
    },
    {
        id: 4,
        cover: 'http://al.ltyjyw.site/assets/Slideshow/books/books-4.jpeg'
    },
    {
        id: 5,
        cover: 'http://al.ltyjyw.site/assets/Slideshow/books/books-5.jpeg'
    }
])
//查询变量
const sqlData = ref<PageByType>({
    page: 1,
    itemsPerPage: 5,
    by: 'popularity',
    des: 'DESC'
})

// 最新的8条资讯
const informationTime = ref<InformationType>()
// 最火的8条资讯
const informationCount = ref<InformationType>()
// 获取资讯事件函数
const getInformationList = async () => {
    sqlData.value.by = 'time'
    sqlData.value.itemsPerPage = 8
    const { data } = await informationApprovedGetListAPI(sqlData.value)
    informationTime.value = JSON.parse(JSON.stringify(data.data.value))
    informationCount.value =JSON.parse(JSON.stringify(data.data.value))
    informationCount.value?.sort((a,b)=>b.count - a.count)
}
await getInformationList()

// 图书信息变量
const booksList = ref<BooksResListType>()
// 获取重点信息变量
const KeyList = ref<Category2ListType>()
const KeyBookList = ref<BooksResListType>()
// 获取重点图书与分类函数
const getKeyList = async () => {
    sqlData.value.itemsPerPage = 6
    sqlData.value.by = 'popularity'
    const { data } = await booksGetListNoPageAPI(sqlData.value)
    booksList.value = data.data.value
    const res = await category2ListAPI(sqlData.value)
    KeyList.value = res.data.data.value
}
await getKeyList()
KeyBookList.value = JSON.parse(JSON.stringify(booksList.value))

// 鼠标划入导航事件函数
const onMouseoverNav = async (cid: number, fage: number) => {
    await getKeyList()
    newBookList.value = JSON.parse(JSON.stringify(booksList.value))
    KeyBookList.value = JSON.parse(JSON.stringify(booksList.value))
    if (fage === 0) {
        newBookList.value = newBookList.value?.filter(item => item.cid == cid)

    } else {
        KeyBookList.value = KeyBookList.value?.filter(item => item.cid == cid)
    }
}

// 最新图书变量
const newBookList = ref<BooksResListType>()
newBookList.value = JSON.parse(JSON.stringify(booksList.value))
newBookList.value?.sort((a, b) => {
    const timea = new Date(a.time)
    const timeb = new Date(b.time)
    return timeb.getTime() - timea.getTime()
})

// 排行榜变量
const countBookList = ref<BooksResListType>()
countBookList.value = JSON.parse(JSON.stringify(booksList.value))
countBookList.value?.sort((a, b) => b.popularity - a.popularity)
// 控制排行榜样式变量
const rankingsIndex = ref(0)

// 图书点击事件函数
const clickBook = (id: number) => {
    router.push(`/booksInfo?id=${id}`)
}

// 资讯点击事件
const onInformation = (id:number) => {
    router.push(`/informationInfo?id=${id}`)
}
</script>
<template>
    <div class="box">
        <img class="img" src="http://al.ltyjyw.site/assets/bg/slideshow-bg.jpg" alt="">
        <el-carousel indicator-position="outside" height="492px">
            <el-carousel-item v-for="item in bookList" :key="item">
                <img :src="item.cover" alt="" @click="clickBook(item.id)">
            </el-carousel-item>
        </el-carousel>
        <div class="box-information">
            <ul class="box-information-time">
                <span class="box-information--font">最新资讯</span>
                <li v-for="item in informationTime" :key="item.id" @click="onInformation(item.id)">{{ item.title }}</li>
            </ul>
            <ul class="box-information-count">
                <span class="box-information--font">最热资讯</span>
                <li v-for="item in informationCount" :key="item.id" @click="onInformation(item.id)">{{ item.title }}</li>
            </ul>
        </div>
        <div class="box-keyBooks">
            <div class="box-keyBooks-nav">
                <span>重点图书</span>
                <div class="box-keyBooks-nav-main">
                    <div v-for="item in KeyList?.slice(0, 5)" :key="item.id" @mouseover="onMouseoverNav(item.id, 1)">{{
                        item.name }}</div>
                </div>
            </div>
            <div class="box-keyBooks-main">
                <div v-for="item in KeyBookList?.slice(0, 4)" :key="item.id">
                    <img :src="item.cover" alt="" @click="clickBook(item.id)">
                    <div class="box-keyBooks-main-info">
                        <span>{{ item.name }}</span>
                        <div>{{ item.uValue }}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="bok-midfield">
            <img src="http://qiniuy.ltyjyw.site/%E5%AD%A6%E4%B9%A0%E6%96%B0%E6%80%9D%E6%83%B3.png" alt="">
        </div>
        <div class="box-books">
            <div class="box-books-time">
                <div class="box-books-time-nav">
                    <span>新书上架</span>
                    <div class="box-books-time-nav-font">
                        <div v-for="item in KeyList?.slice(0, 5)" :key="item.id" @mouseover="onMouseoverNav(item.id, 0)">{{
                            item.name }}</div>
                    </div>
                </div>
                <div class="box-books-time-main">
                    <div v-for="item in newBookList?.slice(0, 4)" :key="item.id">
                        <img :src="item.cover" alt="" @click="clickBook(item.id)">
                        <div class="box-books-time-font">
                            <span>{{ item.name }}</span>
                            <div>{{ item.uValue }}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="box-books-popularity">
                <div class="box-books-popularity-nav">
                    <img src="http://qiniuy.ltyjyw.site/news-icon.png" alt="">
                    <span>图书排行</span>
                    <div class="box-books-popularity-nav-item" v-for="(item, index) in countBookList" :key="item.id"
                        @mouseover="rankingsIndex = index">
                        <p :class="{ rankingsSelectIndex: rankingsIndex === index }">{{ (index + 1) >= 10 ? index : '0' +
                            (index + 1) }}</p>
                        <img :src="item.cover" alt="" v-if="index === rankingsIndex" @click="clickBook(item.id)">
                        <div><span>{{ item.name }}</span>
                            <p v-if="index === rankingsIndex">{{ item.uValue }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@mixin nav-span {
    font-size: 30px;
    color: red;
    font-family: '程荣光刻楷', sans-serif;
}

@mixin nav-main-div {
    padding-right: 10px;
    padding-left: 10px;
    border-right: 1px red solid;
    align-self: center;
    color: red;
    font-size: 20px;
}

@mixin books-main {
    display: flex;
    background: white;
    padding: 20px;
    justify-content: space-between;
    margin-top: 20px;
    border-top: 5px red solid;
}

.rankingsSelectIndex {
    color: red;
}

body{
    position: relative;
}
.box {
    .img {
        width: 100vw;
        height: 500px;
        position: absolute;
        left: 0;
    }
    .el-carousel {
            width: 1137px;
            height: 429px;
            margin: auto;
            padding-top: 35px;
        }


    .box-information {
        display: flex;
        background: white;
        margin-top: 40px;
        justify-content: space-between;
        font-size: 20px;
        border-top: 5px red solid;

        li {
            margin-top: 20px;
        }

        li:hover {
            color: red;
        }

        .box-information--font {
            font-family: '程荣光刻楷', sans-serif;
            font-size: 35px;
            color: red;
        }
    }

    .box-keyBooks {
        margin-top: 30px;

        .box-keyBooks-nav {
            display: flex;
            justify-content: space-between;

            span {
                @include nav-span;
            }

            .box-keyBooks-nav-main {
                display: flex;

                div {
                    @include nav-main-div;
                }

                div:hover {
                    font-weight: bold;
                }
            }
        }

        .box-keyBooks-main {
            @include books-main;

            .box-keyBooks-main-info {
                text-align: center;

                div {
                    margin-top: 20px;
                    color: #878787;
                }
            }
        }
    }

    .bok-midfield {
        margin-top: 30px;
    }

    .box-books {
        margin-top: 20px;
        display: flex;
        margin-bottom: 20px;

        .box-books-time {
            .box-books-time-nav {
                display: flex;
                justify-content: space-between;

                span {
                    @include nav-span;
                }

                .box-books-time-nav-font {
                    display: flex;

                    div {
                        @include nav-main-div;
                    }

                    div:hover {
                        font-weight: bold;
                    }
                }
            }

            .box-books-time-main {
                @include books-main;
                width: 800px;
                justify-content: space-between;
                margin-right: 20px;

                img {
                    width: 140px;
                }

                .box-books-time-font {
                    text-align: center;

                    div {
                        margin-top: 20px;
                        color: #878787;
                    }
                }
            }
        }

        .box-books-popularity {
            background: white;
            width: 370px;
            padding: 5px;

            .box-books-popularity-nav {
                span {
                    font-family: '程荣光刻楷', sans-serif;
                    font-size: 25px;
                    align-items: center;
                }

                .box-books-popularity-nav-item {
                    padding: 10px;
                    display: flex;
                    align-items: center;
                    margin-left: 5px;
                    border-top: 1px #666666 solid;

                    p {
                        font-size: 20px;
                        margin-right: 10px;
                    }

                    img {
                        width: 105px;
                    }

                    div {
                        font-size: 16px;
                        color: #666666;

                        p {
                            font-size: 15px;
                        }
                    }
                }

            }
        }

    }
}
</style>