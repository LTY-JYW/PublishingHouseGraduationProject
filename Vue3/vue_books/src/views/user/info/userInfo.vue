<script lang="ts" setup>
import { ref } from 'vue'
// 导入API
import { userGetInfoAPI } from '@/api/user'
// 导入API类型
import type { UserInfoType } from '@/api/user'
// 导入默认头像
import { URLAVATAR, URLBG } from '@/utils/default'
// 用户详细信息变量
const userInfo = ref<UserInfoType>()
// 获取用户详细信息变量
const getInfo = async () => {
    const { data: { data } } = await userGetInfoAPI()
    userInfo.value = data
}
await getInfo()

</script>
<template>
    <div class="box">
        <div class="head">
            <img v-if="userInfo![0].flyer" :src="userInfo![0].flyer" alt="">
            <img v-else :src="URLBG" alt="">
            <el-avatar class="head-avatar" v-if="userInfo![0].avatar" :size="150" :src="userInfo![0].avatar" />
            <el-avatar class="head-avatar" v-else :size="150" :src="URLAVATAR" />
            <div class="head-font">
                <div class="head-font-name">{{ userInfo![0].nickname }}</div>
                <div class="head-font-briefly">{{ userInfo![0].briefly }}</div>
            </div>
            <div class="head-label">
                <el-tag v-if="userInfo![0].isAuthor == 1" type="primary" effect="dark" round>作者</el-tag>
                <el-tag v-else-if="userInfo![0].isAuthor == 0" type="success" effect="dark" round>普通用户</el-tag>
                <el-tag v-else type="warning" effect="dark" round>审核中</el-tag>
            </div>
        </div>
        <div class="main">
            <div class="menu">
                <el-menu active-text-color="#66CCFF" background-color="#ffffff" :default-active="$route.path"
                    text-color="#121315" router>
                    <div class="menu-font">个人中心</div>
                    <el-menu-item index="/userInfoLayout/userIndex">
                        <el-icon><User /></el-icon>
                        <span>个人中心</span>
                    </el-menu-item>
                    <el-menu-item index="/userInfoLayout/userAuthor" v-if="userInfo![0].isAuthor == 0">
                        <el-icon><Edit /></el-icon>
                        <span>申请作者</span>
                    </el-menu-item>
                    <el-menu-item index="/userInfoLayout/Avatar">
                        <el-icon><FullScreen /></el-icon>
                        <span>查看订单</span>
                    </el-menu-item>
                    <el-menu-item index="/userInfoLayout/Avatar">
                        <el-icon><FullScreen /></el-icon>
                        <span>查看购物车</span>
                    </el-menu-item>

                </el-menu>
            </div>
            <div class="mains">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

    
<style scoped lang="scss">
.box {
    width: 80vw;
    margin: auto;
    padding-top: 100px;

    .head {
        position: relative;
        margin-bottom: 30px;
        img {
            width: 100%;
        }

        .head-avatar {
            position: absolute;
            top: 25%;
            left: 1%;
        }

        .head-font {
            position: absolute;
            left: 12%;
            top: 35%;
            color: white;

            .head-font-name {
                font-size: 50px;
                font-weight: bold;
            }

            .head-font-briefly {
                font-size: 30px;
            }
        }

        .head-label {
            position: absolute;
            top: 88%;
            left: 4.5%;
        }
    }

    .main{
        display: flex;
        .menu{
            width: 15vw;
            height: 100vh;
            .menu-font{
                font-size: 50px;
              font-family: '程荣光刻楷', sans-serif;
              text-align: center;
              align-items: center;
              color: #66ccff;
              margin-bottom: 20px;
            }
            .el-menu {
                padding: 30px;
                padding-left: 20px;
                // padding-right: 0px;
                font-size: 30px;
                height: 83vh;
                .el-menu-item{
                    font-size: 30px;
                    margin-top: 10px;
                }
            }
        }
        .mains{
            margin: 0;
            width: 10vw;
            margin-left: 10px;
        }
    }
}
</style>
