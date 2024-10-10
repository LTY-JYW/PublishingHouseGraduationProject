<script setup lang="ts">
import { ref, onMounted } from 'vue'
// 导入路由
import { useRouter } from 'vue-router'
// 导入pinia
import { useUserStore } from '@/stores/user'
// 导入API
import { adminGetInfoApi } from '@/api/admin'
import { auditGetInfo } from '@/api/audit'
// 导入公共类型
import type { AdminGetInfoType } from '@/api/admin'
// 导入默认头像
import { URL } from '@/utils/defaultAvatar'
// 导入el图标
import {
  Management,
  User,
  SwitchButton,
  CaretBottom
} from '@element-plus/icons-vue'
// 导入el组件
import { ElMessageBox } from 'element-plus'


// 使用pinan
const userStore = useUserStore()
// 判断管理员和审核员变量
const isAdmin = ref<boolean>()
if (userStore.permissions === 0) {
  isAdmin.value = true
}else if(userStore.permissions === 1){
  isAdmin.value = false
}
// 管理员信息
const adminInfo = ref<AdminGetInfoType>([{
  id: 0,
  username: '',
  nickname: '',
  avatar: ''

}])
// 管理员头像
const avatar = ref<string>('')

// 获取管理员信息函数
const getInfo = async () => {
  const res = ref()
  if (isAdmin.value) {
    res.value = await adminGetInfoApi()
  }else {
    res.value = await auditGetInfo()
  }
  adminInfo.value = res.value.data.data
  if (adminInfo.value[0].avatar) {
    avatar.value = adminInfo.value[0].avatar
  } else {
    avatar.value = URL
  }
}
onMounted(async () => {
  await getInfo()
})

const router = useRouter()

// 点击头像事件函数
const onClickAvatar = () => {

}
// 点击下拉菜单事件函数
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
</script>

<template>
  <el-container class="layout-container">
    <el-aside width="200px">
      <div class="el-aside__logo"></div>
      <el-menu active-text-color="#ffd04b" background-color="#232323" :default-active="$route.path" text-color="#fff"
        router>
        <el-menu-item index="/admin/audit" v-if="isAdmin">
          <el-icon>
            <Stamp />
          </el-icon>
          <span>审核员管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/books">
          <el-icon>
            <Management />
          </el-icon>
          <span>{{ isAdmin ? '图书管理' : '图书审核'}}</span>
        </el-menu-item>
        <el-menu-item index="/admin/information">
          <el-icon>
            <ChatLineRound />
          </el-icon>
          <span>{{ isAdmin ? '资讯管理' : '资讯审核'}}</span>
        </el-menu-item>
        <el-sub-menu index="" v-if="isAdmin">
          <template #title>
            <el-icon>
              <Menu />
            </el-icon>
            <span>分类管理</span>
          </template>
          <el-menu-item index="/admin/category">
            <el-icon>
              <Menu />
            </el-icon>
            <span>一级分类</span>
          </el-menu-item>
          <el-menu-item index="/admin/category2">
            <el-icon>
              <Grid />
            </el-icon>
            <span>二级分类</span>
          </el-menu-item>
        </el-sub-menu>
        <el-menu-item index="/admin/user">
          <el-icon>
            <Stamp />
          </el-icon>
          <span>{{ isAdmin ? '用户管理' : '用户审核'}}</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <div>
          管理员：<strong>{{ adminInfo?.[0].nickname }}</strong>
        </div>
        <el-dropdown placement="bottom-end" @command="handCommand">
          <span class="el-dropdown__box" @click="onClickAvatar">
            <el-avatar :src="avatar" />
            <el-icon>
              <CaretBottom />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="info" :icon="User">个人中心</el-dropdown-item>
              <el-dropdown-item command="pwd" :icon="User">修改密码</el-dropdown-item>
              <el-dropdown-item command="avatar" :icon="User">修改头像</el-dropdown-item>
              <el-dropdown-item command="loginOut" :icon="SwitchButton">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
      <el-footer>天翼图书 ©2024 <br> 互联网ICP备案：鄂ICP备2024073345号-1</el-footer>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;


  .el-aside {
    background-color: #232323;

    &__logo {
      height: 120px;
      background: url('@/assets/天依和阿绫.jpg') no-repeat center / 120px auto;

    }

    .el-menu {
      border-right: none;
    }
  }

  .el-header {
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;

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
  }

  .el-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #666;
  }
}
</style>
