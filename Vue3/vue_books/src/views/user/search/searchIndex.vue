<script lang="ts" setup>
import { ref } from 'vue'
// 导入API
import { booksSearchAPI } from '@/api/books'
import { userGetListNoPageAPI } from '@/api/user'
// 导入API类型
import type { BooksResListType, SearchBooksType } from '@/api/books'
import type { UserListType } from '@/api/user'
// 导入路由
import { useRoute } from 'vue-router'
import router from '@/router/index'

// 导入公共函数
import { onBooks, onAuthor, onInformation, onCategory } from '@/utils/funtion'

const route = useRoute()
// 图书Id
const inputData: string = String(route.query.data)

// 搜素提交变量
const page = ref<SearchBooksType>({
    page: 1,
    itemsPerPage: 8,
    data: inputData
})
// 图书变量
const bookList = ref<BooksResListType>([])
const booksListNow = ref<BooksResListType>()
// 总数变量
const count = ref<number>()
const isNull = ref(false)
// 获取图书列表函数
const getList = async () => {
    page.value.data = inputData
    const { data: { data } } = await booksSearchAPI(page.value)
    bookList.value = data.value
    count.value = data.count
    if (data.value.length === 0) {
        isNull.value = true
    }

}
await getList()
booksListNow.value = JSON.parse(JSON.stringify(bookList.value))

// 作者列表变量
const userList = ref<UserListType>()
// 中间作者变量
const userX = ref<UserListType>()
// 获取作者列表函数
const getUserList = async () => {
    const { data: { data } } = await userGetListNoPageAPI()
    userX.value = data.value
}
await getUserList()
userList.value = JSON.parse(JSON.stringify(userX.value))

// 筛选变量
const search = ref()
// 筛选搜索变量
const input = ref('')
// 显示隐藏筛选变量
const isSearch = ref(false)
// 筛选搜索作者函数
const handleInput = () => {
    userList.value = userList.value?.filter(item => item.nickname.includes(input.value))
    if (input.value == '' || input.value == undefined) {
        userList.value = JSON.parse(JSON.stringify(userX.value))
    }
}
// 筛选发生变化函数
const onCheckbox = async () => {
    booksListNow.value = JSON.parse(JSON.stringify(bookList.value))
    booksListNow.value = booksListNow.value?.filter(item => search.value.includes(item.uid))
    if (!search.value || search.value.length == 0) {
        booksListNow.value = JSON.parse(JSON.stringify(bookList.value))
    }
}


// 无限滚动加载函数
const load = async () => {
    page.value.page = page.value.page + 1
    await getList()
    booksListNow.value?.push(...bookList.value)
}

const searchInputData = ref<string>()
searchInputData.value = inputData
// 搜索框确定函数
const handleEnter = () => {
    router.push(`/search?data=${searchInputData.value}`)
}
</script>
<template>
    <div class="box">
        <div class="nav" @click="isSearch = false">
            <div class="nav-count">
                {{ count }}本书
                <svg viewBox="0 0 24 24" fill="none" class="nav-svg" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4V18" stroke="#000000" stroke-linecap="square" stroke-linejoin="round"
                        class="line-animation"></path>
                    <path d="M19 12L12 19L5 12" stroke="#000000" stroke-linecap="square" class="line-animation"></path>
                </svg>
            </div>
            <div class="nav-value">
                <input type="text" v-model="searchInputData" placeholder="在这里搜索" class="drawer-input" ref="searchInput"
                    @keyup.enter="handleEnter" />
                <el-icon class="drawer-icon" style="font-size: 3vw;" @click="handleEnter">
                    <Right />
                </el-icon>
            </div>
        </div>
        <div class="filters">
            <el-checkbox-group class="filters-checkbox" v-model="search" size="large" v-if="isSearch" @change="onCheckbox">
                <input type="text" v-model="input" placeholder="搜索作者" class="filters-input" ref="searchInput"
                    @input="handleInput" />
                <el-scrollbar class="filters-checkbox-scroll">
                    <el-checkbox class="filters-checkbox-item" v-for="item in userList" :key="item.id"
                        :label="item.nickname" :value="item.id" />
                </el-scrollbar>
            </el-checkbox-group>
            <div class="filters-author mouse" @click="isSearch = true">
                作者
                <el-icon>
                    <ArrowDown />
                </el-icon>
            </div>
        </div>
        <div v-if="!isNull" class="main" @click="isSearch = false">
            <div class="main-item mouse" v-for="item in booksListNow" :key="item.id" @click="onBooks(item.id)">
                <div class="main-item-img">
                    <img :src="item.cover" alt="">
                </div>
                <div class="main-item-author">
                    {{ item.uValue }}
                </div>
                <div class="main-item-name">
                    {{ item.name }}
                </div>
            </div>
        </div>
        <div v-else class="main">未找到结果 </div>
        <div class="bottom">
            <div v-if="!isNull" class="bottom-font" @click="load">显示更多书籍</div>
            <div v-else class="bottom-font">暂无图书信息</div>
        </div>
    </div>
</template>
    
<style lang="scss" scoped>
.mouse:hover {
    /* 将鼠标指针变为手形 */
    cursor: pointer;
}

body {
    background: rgb(250, 250, 247);
}

.nav {
    display: flex;
    justify-content: space-between;
    padding: 2vw;
    padding-top: 15vw;
    border-bottom: 1px solid black;

    .nav-count {
        border-top: 1px solid black;
        border-bottom: 1px solid black;
        height: 22px;
        font-size: 20px;
        width: 10vw;
        text-align: center;
        align-items: center;
        padding: 20px;
        margin-top: 5vw;
        display: flex;
        justify-content: space-between;
    }

    .nav-svg {
        width: 23px;

        @keyframes moveDown {
            0% {
                stroke-dashoffset: 100%;
            }

            100% {
                stroke-dashoffset: 0%;
            }
        }

        .line-animation {
            stroke-dasharray: 100%;
            stroke-dashoffset: 100%;
            animation: moveDown 2s ease-in-out infinite;
        }
    }

    .nav-name {
        font-family: '程荣光刻楷', sans-serif;
        font-size: 10vw;
    }

    .drawer-input {
        padding: 10px;
        /* 移除所有边框 */
        border: none;
        /* 仅保留底边框 */
        border-bottom: 1px solid #ccc;
        outline: none;
        box-sizing: border-box;
        font-size: 80px;
        width: 60%;
        background: rgb(250, 250, 247);
    }

    .drawer-input:focus {
        border-bottom-color: #66CCFF;
    }
}


.filters {
    border-top: 1px black solid;
    border-bottom: 1px black solid;
    margin-top: 100px;
    display: flex;
    padding: 20px;
    position: relative;

    .filters-input {
        padding: 10px;
        /* 移除所有边框 */
        border: none;
        /* 仅保留底边框 */
        border-bottom: 1px solid #ccc;
        outline: none;
        box-sizing: border-box;
        font-size: 40px;
        width: 100%;
    }

    .filters-input:focus {
        border-bottom-color: #66CCFF;
    }

    .filters-checkbox {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 62px;
        left: 25px;
        background: white;
        padding: 50px;
        box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3);

        .filters-checkbox-scroll {
            display: flex;
            flex-direction: column;
            width: 400px;
        }

        .filters-checkbox-item {
            margin-top: 10px;
            margin-bottom: 10px;
        }

        :deep(.el-checkbox__label) {
            font-size: 30px;
        }

        :deep(.el-checkbox__inner) {
            width: 20px;
            height: 20px;
        }

        .filters-author {
            padding: 10px;
        }
    }
}

.box {
    padding: 20px;
}

.main {
    margin-top: 100px;
    display: flex;
    flex-wrap: wrap;

    .main-profile {
        font-size: 5vw;
        font-family: '程荣光刻楷', sans-serif;
        width: 40%;
        margin-right: 7vw;
    }

    .main-item {
        .main-item-img {
            padding: 76px;
            background: rgb(240, 240, 235);
            margin-right: 10px;
            margin-top: 100px;

            img {
                width: 15vw;
            }
        }

        .main-item-author {
            font-size: 18px;
        }

        .main-item-name {
            font-size: 20px;
        }
    }
}

.bottom {
    text-align: center;

    .bottom-font {
        font-size: 20px;
        font-family: '程荣光刻楷', sans-serif;
        margin: 50px;
    }
}
</style>