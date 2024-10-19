<script lang="ts" setup>
import { ref } from 'vue'
// 导入API
import { userGetInfoAPI } from '@/api/user'
import { getHtmlAPI } from '@/api/uploads'
// 导入API类型
import type { UserInfoType } from '@/api/user'
// 导入公共函数
import { formDate } from '@/utils/dayjs'
// 导入路由
import { useRoute } from 'vue-router'
// 导入pinia
import { useUserStore } from '@/stores/user'
// 导入默认头像
import { URLAVATAR, URLBG } from '@/utils/default'

const router = useRoute()
// 用户详细信息变量
const userInfo = ref<UserInfoType>()
// 获取用户详细信息变量
const getInfo = async () => {
    const { data: { data } } = await userGetInfoAPI()
    userInfo.value = data
    console.log(userInfo.value);

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
                    <el-menu-item index="/userInfoLayout/userIndex">
                        <el-icon><User /></el-icon>
                        <span>个人中心</span>
                    </el-menu-item>
                    <el-menu-item index="/userInfoLayout/userAuthor">
                        <el-icon><Edit /></el-icon>
                        <span>申请作者</span>
                    </el-menu-item>
                    <el-menu-item index="/userInfoLayout/Avatar">
                        <el-icon><FullScreen /></el-icon>
                        <span>更新头像</span>
                    </el-menu-item>

                </el-menu>
            </div>
            <div class="main">
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
        margin-top: 20px;
        display: flex;
        .menu{
            width: 20vw;
            .el-menu {
                // padding: 100px;
                padding: 30px;
                padding-left: 40px;
                padding-right: 50px;
                font-size: 30px;
                .el-menu-item{
                    font-size: 30px;
                }
            }
        }
        .main{
            width: 50vw;
            margin-left: 10px;
        }
    }
}
</style>
