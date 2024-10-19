<script lang="ts" setup>
import { ref } from 'vue'
// 导入API
import { userGetInfoAPI } from '@/api/user'
import { categoryListAPI } from '@/api/category2'
import { informationApprovedGetListAPI } from '@/api/information'
import { userGetListNoPageAPI } from '@/api/user'
import { booksGetListNoPageAPI } from '@/api/books'

// 导入API类型
import type { UserInfoType } from '@/api/user'
import type { categoryListType } from '@/api/category2'
import type { PageByType } from '@/api/results'
import type { InformationType } from '@/api/information'
import type { UserListType } from '@/api/user'
import type { BooksResListType } from '@/api/books'
import type { ByType } from '@/api/results'

// 导入el图标
import { Search, User, SwitchButton, CaretBottom } from '@element-plus/icons-vue'

// 导入el组件
import { ElMessageBox } from 'element-plus'
// 导入路由
import { RouterView } from 'vue-router'
import router from '@/router/index'
// 导入pinia
import { useUserStore } from '@/stores/user'
// 导入路由
import { useRoute } from 'vue-router'
// 导入公共函数
import { onBooks, onAuthor, onInformation} from '@/utils/funtion'

const route = useRoute()
// 图书Id
const path = route.path
// 搜索变量
const searchData = ref('')

// 导航点击事件
const onClickNav = (value: string) => {
  router.push(`${value}`)
}
const onClear = () => { }

// 使用pinia
const userStore = useUserStore()
// 用户详细信息变量
const userInfo = ref<UserInfoType>()
// 获取用户信息事件函数
const getInfo = async () => {
  if (userStore.permissions === 2) {
    const { data } = await userGetInfoAPI()
    userInfo.value = data.data
  } else {
    return
  }
}

// 判断是否登录变量
const isLogin = ref(false)
if (userStore.token && userStore.permissions === 2) {
  isLogin.value = true
  await getInfo()
} else {
  isLogin.value = false
}

// 头像划入事件函数
const handCommand = async (command: string | number | object) => {
  if (command === 'loginOut') {
    ElMessageBox.confirm('你确定要退出吗？', '确认对话框', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(async () => {
      // 用户点击确定后的操作
      userStore.removeToken()
      router.push('/login')
    }).catch(() => {
      // 用户点击取消后的操作
    });
  } else {
    router.push(`/admin/${command}`)
  }
}
// 头像点击事件
const onClickAvatar = () => {
  if (isLogin.value) {
    console.log('一登陆');
  } else {

    router.push('/login')
  }
}

// 获取分类名
const categoryName = ref<categoryListType>()
const getCategory = async () => {
  const { data: { data } } = await categoryListAPI()
  categoryName.value = data
}

// 获取资讯
const page = ref<PageByType>({
  page: 1,
  itemsPerPage: 100,
  by: 'count',
  des: 'DESC'
})
const information = ref<InformationType>()
const getInformation = async () => {
  const { data: { data } } = await informationApprovedGetListAPI(page.value)
  information.value = data.value
}

const flage = ref('')

// 获取用户
const userList = ref<UserListType>()
const getUserLsit = async () => {
  const { data: { data } } = await userGetListNoPageAPI()
  userList.value = data.value
  userList.value = userList.value.filter((item) => item.isAuthor == 1)
  userList.value?.sort((a, b) => b.heat - a.heat)
}
await getUserLsit()
// 控制鼠标变量
const isHover = ref(false)
// 鼠标划入事件函数
const handover = async (fage: string) => {
  isHover.value = true
  flage.value = fage
  if (!categoryName.value && fage == 'books') {
    await getCategory()
  }
  if (!information.value && fage == 'information') {
    await getInformation()
  }
  if (!userList.value && fage == 'author') {
    await getUserLsit()
  }
}
// 鼠标划出事件函数
const handout = () => {
  isHover.value = false
}

// 搜索打开弹窗变量
const search = ref(false)
// 弹窗搜索变量
const input = ref('')
// 查询提交变量
const pageBy = ref<ByType>({
  by: 'popularity',
  des: 'DESC'
})
// 图书列表变量
const bookList = ref<BooksResListType>()
// 获取图书列表
const getBookList = async () => {
  const { data: { data } } = await booksGetListNoPageAPI(pageBy.value)
  bookList.value = data.value
}
await getBookList()

// 点击导航
const handNav = (id: number, flage: string) => {
  if (flage == 'category') {
    router.push(`/category?id=${id}`)
  }

}
</script>
<template>
  <div class="box">
    <div class="box-nav">
    <div :style="path == '/'?{ color: 'white' }:{ color: 'black' }" class="index mouse" @click="()=>{router.push(`/`)}">天翼图书</div>
      <!-- 文字 -->
      <div id="container"
        :style="isHover ? { width: '40vw', background: 'white' } : { width: '4vw', background: 'rgba(1,1,1,0)' }"
        @mouseleave="handout">
        <div>
          <div class="item"
            :style="isHover ? { color: 'black' } : path == '/'?{ color: 'white' }:{ color: 'black' }"
            @mouseenter="handover('books')">图书
          </div>
          <div class="item"
            :style="isHover ? { color: 'black' } : path == '/'?{ color: 'white' }:{ color: 'black' }"
            @mouseenter="handover('information')">
            资讯</div>
          <div class="item"
            :style="isHover ? { color: 'black' } : path == '/'?{ color: 'white' }:{ color: 'black' }"
            @mouseenter="handover('author')">作者
          </div>
        </div>
        <!-- 弹出内容 -->
        <div v-show="isHover" class="content">
          <div class="nav-item" v-if="flage === 'books'">
            <a href="">
              <div>所有图书</div>
            </a>
            <span style="color: #66ccff;">类别</span>
            <el-scrollbar height="85vh">
              <div v-for="item in categoryName" :key="item.value">
                <span>{{ item.label }}</span>
                <div class="nav-item-main mouse" v-for="itemC in item.children" :key="itemC.value" style="margin-top: 0;"
                  @click="handNav(itemC.value, 'category')">
                  {{ itemC.label }}
                </div>
              </div>
            </el-scrollbar>
          </div>
          <div class="nav-item" v-else-if="flage === 'information'">
            <a href="">
              <div>所有资讯</div>
            </a>
            <div class="nav-item-main mouse" v-for="item in information" :key="item.id" @click="onInformation(item.id)">{{ item.title }}</div>
          </div>
          <div class="nav-item" v-else-if="flage === 'author'">
            <a href="">
              <div>作者列表</div>
            </a>
            <div class="nav-item-main mouse" v-for="item in userList" :key="item.id" @click="onAuthor(item.id)">{{ item.nickname }}</div>
          </div>

        </div>
        <!-- 更多项... -->
      </div>
      <div class="nav">
        <!-- 首页部分 -->
        <!-- 搜索表单部分 -->
        <div :style="path == '/'?{ color: 'white' }:{ color: 'black' }" class="search mouse" @click="search = true">
          <el-icon>
            <Search />
          </el-icon>
          <span>搜索书籍和作者</span>
        </div>
        <!-- 头像 -->
        <div class="avatar mouse">
          <el-dropdown placement="bottom-end" @command="handCommand">
            <span class="el-dropdown__box" @click="onClickAvatar">
              <el-avatar :size="60" v-if="isLogin" :src="userInfo![0].avatar" />
              <el-avatar :size="60" v-else> 未登录 </el-avatar>
              <el-icon v-if="isLogin">
                <CaretBottom />
              </el-icon>
            </span>
            <template #dropdown v-if="isLogin">
              <el-dropdown-menu>
                <el-dropdown-item command="info" :icon="User">个人中心</el-dropdown-item>
                <el-dropdown-item command="pwd" :icon="User">修改密码</el-dropdown-item>
                <el-dropdown-item command="avatar" :icon="User">修改头像</el-dropdown-item>
                <el-dropdown-item command="loginOut" :icon="SwitchButton">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>
    <div class="main">
      <Suspense>
        <RouterView />
      </Suspense>
    </div>
    <!-- 搜索抽屉 -->
    <el-drawer v-model="search" direction="ttb" class="drawer" size="80%">
      <input type="text" v-model="input" placeholder="在这里搜索" class="drawer-input" ref="searchInput" />
      <el-icon class="drawer-icon">
        <Right />
      </el-icon>
      <div style="display: flex;">
        <div>
          <div class="drawer-popular">热门图书</div>
          <div class="drawer-main">
            <div class="item mouse" v-for="item in bookList?.slice(0,4)" :key="item.id" @click="onBooks(item.id)">
              <div class="item-img">
                <img :src="item.cover" alt="">
              </div>
              <div class="item-username">{{ item.uValue }}</div>
              <div class="item-name">{{ item.name }}</div>
            </div>
          </div>
        </div>
        <div style="margin-left: 5vw;">
          <div class="drawer-popular">作者</div>
          <div>
            <div class="drawer-item mouse" v-for="item in userList?.slice(0, 6)" :key="item.id" @click="onAuthor(item.id)">{{ item.nickname }}</div>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
  <div class="footer">
    <span>天翼图书 ©2024</span> <br> 互联网ICP备案：鄂ICP备2024073345号-1
  </div>
</template>
    
<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
  user-select: none;
}

.mouse:hover {
  /* 将鼠标指针变为手形 */
  cursor: pointer;
}

.box {
  width: 100vw;
  margin: auto;
  position: relative;

  .index {
    font-family: '程荣光刻楷', sans-serif;
    position: absolute;
    font-size: 40px;
    left: 45%;
    top: 1%;
  }

  .box-nav {
    width: 100vw;
    position: absolute;
    top: 0px;
    left: 0px;
    z-index: 999;

    #container {
      padding: 10px;
      padding-left: 20px;
      padding-top: 20px;
      display: flex;
      transition: width 0.5s;
      z-index: 999;

      .item {
        cursor: pointer;
        font-size: 20px;
        color: white;
        padding: 10px;
        padding-top: 20px;
        width: 4vw;
      }

      .content {
        display: flex;
        flex-direction: column;
        margin-left: 200px;
        border-left: 1px black solid;
        width: 400px;
        height: 96.5vh;

        .nav-item {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          padding: 10px;
          padding-top: 20px;

          a {
            text-decoration: none;

            div {
              font-size: 30px;
              font-family: '程荣光刻楷', sans-serif;
              color: #66CCFF;
              margin-bottom: 20px;
            }
          }

          span {
            font-size: 18px;
            color: rgb(114, 114, 114);
          }

          .nav-item-main {
            font-size: 20px;
            padding: 10px;
            /* 限制内容在一行显示 */
            white-space: nowrap;
            /* 隐藏超出部分的内容 */
            overflow: hidden;
            /* 超出部分显示省略号 */
            text-overflow: ellipsis;
          }
        }

      }

    }

    .nav {
      position: absolute;
      top: 0;
      right: 0;
      display: flex;
      justify-content: space-between;
      padding: 20px;

      .search {
        color: white;
        font-size: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom: 1px white solid;
        margin-right: 20px;

        span {
          padding-left: 20px;
        }
      }

      .avatar {
        :focus {
          /* 移除聚焦时的边框 */
          outline: none;
        }
      }
    }




  }

  .drawer {
    padding: 10px;
    background: rgb(250, 250, 247);

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
    }

    .drawer-input:focus {
      border-bottom-color: #66CCFF;
    }

    .drawer-icon {
      font-size: 50px;
    }

    .drawer-popular {
      font-size: 18px;
      color: rgb(150, 150, 150);
      margin-top: 10px;
      margin-bottom: 10px;
    }

    .drawer-main {
      display: flex;
      width: 60%;

      .item {
        margin: 10px;

        .item-img {
          background: rgb(240, 240, 235);
          padding: 60px;

          img {
            width: 150px;
          }
        }


        .item-username {
          font-size: 18px;
          margin-top: 10px;
        }

        .item-name {
          font-size: 20px;
          margin-top: 8px;
        }
      }
    }

    .drawer-item {
      font-size: 35px;
      font-family: '程荣光刻楷', sans-serif;
      padding: 10px;
    }
  }
}

.footer {
  width: 100%;
  background: #66ccff;
  color: white;
  font-size: 20px;
  padding: 10px;
  text-align: center;
  margin-top: 20px;

  span {
    margin-bottom: 10px;
  }
}
</style>