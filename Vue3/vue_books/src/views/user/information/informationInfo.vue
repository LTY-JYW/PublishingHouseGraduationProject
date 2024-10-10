<script lang="ts" setup>
import { ref } from 'vue'
// 导入API
import { informationInfoAPI,informationViewsAPI } from '@/api/information'
import { getHtmlAPI } from '@/api/uploads'
// 导入API类型
import type { InforInfoType } from '@/api/information'
// 导入公共函数
import { formDate } from '@/utils/dayjs'
// 导入路由
import { useRoute } from 'vue-router'
// 导入pinia
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const route = useRoute()
const informationId: number = Number(route.query.id)

// 浏览资讯函数
const inforViews = async () => {
    await informationViewsAPI(informationId)
}

if (userStore.token !== localStorage.getItem('TOKEN_KEY')) {
    await inforViews()
}

// 获取资讯详细信息变量
const inforInfo = ref<InforInfoType>()
// 资讯html内容变量
const inforHtml = ref<string>()
// 获取资讯详细信息函数
const getInfo = async () => {
    const { data: { data } } = await informationInfoAPI(informationId)
    inforInfo.value = data
    const res = await getHtmlAPI(inforInfo.value[0].main)
    inforHtml.value = res.data.data.html
}
await getInfo()

</script>
<template>
    <div class="box">
        <div class="head">
            <div class="head-title">{{ inforInfo![0].title }}</div>
            <div class="head-time"> 发布日期： {{ formDate(inforInfo![0].time) }}</div>
        </div>
        <div class="main" v-html="inforHtml"></div>
    </div>
</template>

    
<style scoped lang="scss">
.box {
    background: white;
    .head {
        border-bottom: 1px black solid;
        text-align: center;
        margin-top: 20px;
        padding: 30px;
        .head-title {
            font-size: 40px;
            color: red;
            font-family: '程荣光刻楷', sans-serif;
            margin-bottom: 70px;
        }
        .head-time{
            font-weight: bold;
        }
    }
    .main{
        padding: 20px;
        font-size: 20px;
        line-height: 1.6;
        text-align: center;

    }
    
}
</style>
