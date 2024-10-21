<script lang="ts" setup>
import { ref } from 'vue'
// 导入API
import { booksGetListNoPageAPI, booksGetUserBooksAPI } from '@/api/books'
import { informationApprovedGetListAPI } from '@/api/information'
import { category2ListAPI, categoryHotAPI } from '@/api/category2'
import { userGetListNoPageAPI } from '@/api/user'
import { getHtmlAPI } from '@/api/uploads'
// 导入API类型
import type { BooksResListType, BooksUserType } from '@/api/books'
import type { InformationType } from '@/api/information'
import type { PageByType } from '@/api/results'
import type { Category2ListType, CategoryHotType } from '@/api/category2'
import type { UserListType } from '@/api/user'
import type { HtmlType } from '@/api/uploads'
// 导入路由
import router from '@/router'
// 导入公共函数
import { onBooks, onAuthor, onInformation, onCategory} from '@/utils/funtion'

//查询变量
const sqlData = ref<PageByType>({
    page: 1,
    itemsPerPage: 5,
    by: 'popularity',
    des: 'DESC'
})

// 最新的8条资讯
const informationList = ref<InformationType>()
// 获取资讯事件函数
const getInformationList = async () => {
    sqlData.value.by = 'time'
    sqlData.value.itemsPerPage = 8
    const { data: { data } } = await informationApprovedGetListAPI(sqlData.value)
    informationList.value = data.value
}
await getInformationList()

// const wordToHtml = async (array: InformationType | undefined) => {
//     for (const item of array!) {
//         const { data: { data } } = await getHtmlAPI(item.main);
//         item.main = data.html
//     }
// }

// await wordToHtml(informationList.value)

// 图书信息变量
const booksList = ref<BooksResListType>()
// 获取重点信息变量
const category2Hot = ref<CategoryHotType>()
// 获取重点图书与分类函数
const getKeyList = async () => {
    sqlData.value.itemsPerPage = 18
    sqlData.value.by = 'time'
    const { data } = await booksGetListNoPageAPI(sqlData.value)
    booksList.value = data.data.value
    const res = await categoryHotAPI()
    category2Hot.value = res.data.data
}
await getKeyList()

// 排行榜变量
const countBookList = ref<BooksResListType>()
countBookList.value = JSON.parse(JSON.stringify(booksList.value))
countBookList.value?.sort((a, b) => b.popularity - a.popularity)

// 用户变量
const userList = ref<UserListType>()
// 最新用户
const userNewList = ref<UserListType>()
// 最新用户图书列表
const usersNewBooks = ref<BooksUserType>()
// 获取用户列表函数
const getUserList = async () => {
    const { data: { data } } = await userGetListNoPageAPI()
    userList.value = data.value
    userList.value?.sort((a, b) => b.heat - a.heat)
    userNewList.value = JSON.parse(JSON.stringify(data.value))
    userNewList.value?.sort((a, b) => {
        // 将字符串转换为Date对象
        const dateA = new Date(a.time);
        const dateB = new Date(b.time);
        // 比较两个Date对象的时间戳
        return dateB.getTime() - dateA.getTime();
    })
    const res = await booksGetUserBooksAPI(userNewList.value![0].id)
    usersNewBooks.value = res.data.data.value
}
await getUserList()

</script>
<template>
    <div class="box">
        <!-- 跑马灯 -->
        <el-carousel indicator-position="none" height="auto">
            <el-carousel-item v-for="item in userList?.slice(0, 4)" :key="item.id" style="height: 50vw" @click="onAuthor(item.id)">
                <img :src="item.flyer" alt="" @click="onBooks(item.id)">
                <div class="font">
                    <div>{{ item.nickname }}</div>
                </div>
            </el-carousel-item>
        </el-carousel>
        <!-- 热门分类 -->
        <div class="hot">
            <div class="hot-font">热门类别</div>
            <div style="display: flex;flex-wrap: wrap;">
                <div @click="onCategory(item.id)" class="item mouse" v-for="item in category2Hot?.slice(0,9)" :key="item.id">
                    {{ item.name }} /
                </div>
            </div>
        </div>
        <!-- 新书上架 -->
        <div class="newBooks">
            <div class="newBooks-font">新的图书</div>
            <div style="display: flex;flex-wrap: wrap;justify-content: space-between;">
                <div class="newBooks-item mouse" v-for="item in booksList?.slice(0,15)" :key="item.id" @click="onBooks(item.id)">
                    <img :src="item.cover" alt="" @click="onBooks(item.id)">
                    <div class="newBooks-item-uValue">{{ item.uValue }}</div>
                    <div class="newBooks-item-name">{{ item.name }}</div>
                </div>
            </div>
            <div style="text-align: center;">查看所有图书</div>
        </div>
        <!-- 最热门作者 -->
        <div class="author">
            <div class="author-img mouse" v-for="item in userNewList?.slice(0, 1)" :key="item.id" @click="onAuthor(item.id)">
                <img :src="item.flyer" alt="">
                <div class="author-img-name">{{ item.nickname }}</div>
                <div class="author-img-briefly">{{ item.briefly }}</div>
            </div>
            <el-carousel arrow="never" class="author-carousel">
                <el-carousel-item class="mouse" v-for="item in usersNewBooks?.slice(0, 4)" :key="item.id" style="height: 50vw" @click="onBooks(item.id)">
                    <div class="author-carousel-img">
                        <img :src="item.cover" alt="" @click="onBooks(item.id)">
                    </div>
                    <div class="author-carousel-uValue">{{ item.uValue }}</div>
                    <div class="author-carousel-name">{{ item.name }}</div>
                </el-carousel-item>
            </el-carousel>
        </div>
        <div class="news">
            <div class="news-font">新闻与资讯</div>
            <div style="display: flex;flex-wrap: wrap;">
                <div class="news-item mouse" v-for="item in informationList" :key="item.id" @click="onInformation(item.id)">
                    <img class="news-item-img" :src="item.cover" alt="">
                    <div class="news-item-title">{{ item.title }}</div>
                    <!-- <div class="news-item-main" v-html="item.main"></div> -->
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.mouse:hover {
    /* 将鼠标指针变为手形 */
    cursor: pointer;
}

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

body {
    position: relative;
}

.box {
    .el-carousel {
        position: relative;

        img {
            width: 100%;
            height: auto;
        }

        .font {
            position: absolute;
            top: 60%;
            left: 5%;
            color: white;
            font-family: '程荣光刻楷', sans-serif;
            font-size: 120px;
        }
    }

    .hot {
        margin-top: 50px;
        margin-left: 20px;

        .hot-font {
            font-size: 18px;
        }

        .item {
            font-size: 100px;
            font-family: '程荣光刻楷', sans-serif;
            margin: 20px;
            white-space: nowrap;
        }
    }

    .author {
        margin-top: 100px;
        display: flex;
        // justify-content: space-between;
        width: 100vw;

        .author-img {
            position: relative;
            width: 50%;

            img {
                width: 100%;
            }

            .author-img-name {
                font-size: 60px;
                position: absolute;
                top: 1%;
                left: 1%;
                color: white;
            }

            .author-img-briefly {
                font-size: 20px;
                position: absolute;
                bottom: 1%;
                right: 1%;
                color: white;
                width: 45%;
            }
        }

        .author-carousel {
            width: 30%;
            margin-left: auto;

            .author-carousel-img {
                width: 15vw;
                margin: auto;
                padding: 5vw;
                background: rgb(240, 240, 235);

                img {
                    width: 15vw;
                }
            }

            .author-carousel-uValue {
                margin-top: 10px;
                padding-left: 2.5vw;
            }

            .author-carousel-name {
                margin-top: 10px;
                padding-left: 2.5vw;

            }
        }
    }

    .news {
        margin-top: 100px;

        .news-font {
            font-size: 50px;
            font-family: '程荣光刻楷', sans-serif;

        }

        .news-item {
            width: 20vw;
            max-height: 50vw;
            overflow: hidden;
            padding: 20px;
            background: rgb(240, 240, 235);
            margin: 20px;
            margin-bottom: 50px;
            text-align: center;

            .news-item-img {
                width: 15vw;
            }

            .news-item-title {
                font-size: 30px;
                font-weight: bold;
                margin-top: 20px;
                margin-bottom: 20px;
            }

            .news-item-main {
                :deep(img) {
                    width: 0px;
                    height: 0px;
                }
            }
        }
    }
    .newBooks {
        margin-top: 50px;
        margin-left: 20px;

        .newBooks-font {
            font-size: 70px;
        }

        .newBooks-item {
            margin: 20px;
            background: rgba(250, 250, 247, 0);
            img{
                width: 15vw;
            }

            .newBooks-item-name {
                margin-top: 5px;
                text-align: center;
                font-size: 23px;
            }

            .newBooks-item-uValue {
                margin-top: 5px;
                text-align: center;
                font-size: 20px;

            }
        }
    }
}</style>