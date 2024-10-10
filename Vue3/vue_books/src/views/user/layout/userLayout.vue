<script lang="ts" setup>
import { ref } from 'vue'
// 导入API
import { userGetInfoAPI } from '@/api/user'
// 导入API类型
import type { UserInfoType } from '@/api/user'
// 导入el图标
import { Search,User,SwitchButton,CaretBottom } from '@element-plus/icons-vue'

// 导入el组件
import { ElMessageBox } from 'element-plus'
// 导入路由
import { RouterView } from 'vue-router'
import router from '@/router/index'
// 导入pinia
import { useUserStore } from '@/stores/user'

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
  if(userStore.permissions === 2){
    const { data } = await userGetInfoAPI()
    userInfo.value = data.data
  }else{
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
  if(isLogin.value){
    console.log('一登陆');
  }else{

    router.push('/login')
  }
}
</script>
<template>
  <div class="box">
    <div class="box-head">
      <div class="box-head-icon">
        <div class="box-head-icon-img">
          <img src="http://qiniuy.ltyjyw.site/%E5%9B%BE%E6%A0%87.png" alt="">
        </div>
        <div class="box-head-icon-font">
          天翼图书
        </div>
      </div>
      <div class="box-head-search">
        <!-- 搜索表单部分 -->
        <el-form :inline="true">
          <!-- 书名和作者搜索 -->
          <el-form-item>
            <el-input v-model="searchData" placeholder="请输入想搜索的书名" clearable :suffix-icon="Search" @clear="onClear"
              size="large" />
          </el-form-item>
        </el-form>
      </div>
      <div class="box-head-avatar">
        <el-dropdown placement="bottom-end" @command="handCommand">
          <span class="el-dropdown__box" @click="onClickAvatar">
            <el-avatar :size="60" v-if="isLogin" :src="userInfo![0].avatar"  />
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
    <div class="box-nav">
      <el-menu :default-active="$route.path" router mode="horizontal" :ellipsis="false" class="box-nav-item">
        <el-menu-item index="/">
          <span>首页</span>
        </el-menu-item>
        <el-menu-item index="/information">
          <span>资讯中心</span>
        </el-menu-item>
        <el-menu-item index="/books">
          <span>图书大全</span>
        </el-menu-item>
        <el-menu-item index="/download">
          <span>资源下载</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="main">
      <Suspense>
        <RouterView />
      </Suspense>
    </div>
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

.box {
  width: 1200px;
  margin: auto;

  .box-head {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .box-head-icon {
      display: flex;
      align-items: center;

      .box-head-icon-img {
        img {
          width: 100px;
          height: 100px;
        }
      }

      .box-head-icon-font {
        font-size: 40px;
        font-family: '程荣光刻楷', sans-serif;
      }
    }
  }


  .box-nav {
    display: flex;

    .el-menu {
      width: 100%;
      justify-content: space-between;

      .el-menu-item {
        width: 30%;
        font-size: 50px;
        background: rgb(102, 204, 255);
      }
    }
  }

  .box-nav-item {
    font-size: 30px;
    font-family: '程荣光刻楷', sans-serif;
    --el-menu-text-color: rgb(255, 255, 255);
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


.el-dropdown__box {
      display: flex;
      align-items: center;

      .el-icon {
        color: #999;
        margin-left: 10px;
      }

      &:active,
      &:focus {
        outline: none;
      }
    }
</style>