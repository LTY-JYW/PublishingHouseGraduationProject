<script setup lang="ts">
import { ref,onMounted } from 'vue'
import {
  Management,
  User,
  Crop,
  SwitchButton,
  CaretBottom
} from '@element-plus/icons-vue'
import { adminGetInfoApi } from '@/api/admin'
import type { AdminGetInfoType } from '@/api/admin'
import { URL } from '@/utils/defaultAvatar'

// 管理员信息
const adminInfo = ref<AdminGetInfoType>()
// 管理员头像
const avatar = ref<string>('')

// 获取管理员信息函数
const getInfo = async () => {
  const res = await adminGetInfoApi()
  adminInfo.value = res.data.data
  if (adminInfo.value[0].avatar) {
    avatar.value = adminInfo.value[0].avatar
  }else{
    avatar.value = URL
  }
}


onMounted(async () => {
  await getInfo()
})


</script>

<template>
  <el-container class="layout-container">
    <el-aside width="200px">
      <div class="el-aside__logo"></div>
      <el-menu
        active-text-color="#ffd04b"
        background-color="#232323"
        :default-active="$route.path"
        text-color="#fff"
        router
      >
        <el-menu-item index="/admin/audit">
          <el-icon><Stamp /></el-icon>
          <span>审核员管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/books">
          <el-icon>
            <Management />
          </el-icon>
          <span>图书管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/information">
          <el-icon><ChatLineRound /></el-icon>
          <span>资讯管理</span>
        </el-menu-item>
        <el-sub-menu index="/admin/category">
          <template #title>
            <el-icon><Menu /></el-icon>
            <span>分类管理</span>
          </template>
          <el-menu-item index="/admin/category/one">
            <el-icon><Menu /></el-icon>
            <span>一级分类</span>
          </el-menu-item>
          <el-menu-item index="/admin/category/two">
            <el-icon><Grid /></el-icon>
            <span>二级分类</span>
          </el-menu-item>
        </el-sub-menu>
          <el-menu-item index="/admin/user">
          <el-icon><Stamp /></el-icon>
          <span>用户管理</span>
        </el-menu-item>

        <el-sub-menu index="/adminInfo">
          <template #title>
            <el-icon><HelpFilled /></el-icon>
            <span>个人中心</span>
          </template>
          <el-menu-item index="/adminInfo/avatar">
            <el-icon><FullScreen /></el-icon>
            <span>更新头像</span>
          </el-menu-item>
          <el-menu-item index="/adminInfo/password">
            <el-icon><Unlock /></el-icon>
            <span>重置密码</span>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <div>
          管理员：<strong>{{ adminInfo?.[0].nickname}}</strong>
        </div>
        <el-dropdown
          placement="bottom-end"
          
        >
          <span class="el-dropdown__box">
            <el-avatar
              :src="avatar"
            />
            <el-icon>
              <CaretBottom />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                command="/admin/user/info"
                :icon="User"
                >基本资料</el-dropdown-item
              >
              <el-dropdown-item
                command="avatar"
                :icon="Crop"
                >重置密码</el-dropdown-item
              >
              <el-dropdown-item
                command="logout"
                :icon="SwitchButton"
                >退出登录</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
      <el-footer
        >天翼图书 ©2024 </el-footer
      >
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
      background: url('@/assets/天依和阿绫.jpg')
        no-repeat center / 120px auto;

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
