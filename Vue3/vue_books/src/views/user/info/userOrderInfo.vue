<script lang="ts" setup>
import { ref } from 'vue'
// 导入API
import { orderInfoAPI } from '@/api/order'
import { uploadsFileWordAPI } from '@/api/uploads'
// 导入API类型
import type { OrderInfoType } from '@/api/order'
import type { PageType } from '@/api/results'
// 导入默认头像
import { URLAVATAR, URLBG } from '@/utils/default'
// 导入el图标
import { Delete, Search, Edit, Picture } from '@element-plus/icons-vue'
// 导入el类型
import type { FormRules, FormInstance, UploadInstance, UploadProps, UploadFile, UploadRawFile } from 'element-plus'
// 导入el组件
import { ElMessageBox, ElMessage, genFileId } from 'element-plus'
// 导入公共函数
import { formDate } from '@/utils/dayjs'
import { onOrder } from '@/utils/funtion'
// 导入路由
import { useRoute,useRouter  } from 'vue-router'
// import { useRoute } from '@/router/index'

const route = useRoute()
const router = useRouter()
// 图书Id
const oid: number = Number(route.query.id)

// 加载变量
const loading = ref(true)
// 订单列表变量
const orderList = ref<OrderInfoType>()
// 地址分割变量
const address = ref<string[]>()
// 获取订单列表函数
const getList = async () => {
    const { data: { data } } = await orderInfoAPI(oid)
    if (!data.order) {
        orderList.value = undefined
        loading.value = false
        return
    }
    orderList.value = data
    loading.value = false
    address.value = orderList.value.address.filter(item => item.default == 1)[0].address.split('，')
}
await getList()

// 返回上级路由
const routerBack = () => {
    router.back()
}
</script>
<template>
    <div class="box-author">
        <pageComponent title="订单详细信息">
            <div class="mouse" @click="routerBack"><el-icon><Back /></el-icon>返回</div>
            <div class="main">
                <!-- 表格部分 -->
                <div class="item">
                    <div class="nav">
                        <div class="time">创建时间：{{ formDate(orderList?.order.time || '20210302') }}</div>
                        <div class="id">订单号： {{ orderList?.order.id }}</div>
                        <div class="state">
                            <el-tag v-if="orderList?.order.shipping == 1" type="primary" effect="dark" round> 已发货 </el-tag>
                            <el-tag v-else type="danger" effect="dark" round> 未发货 </el-tag>
                        </div>
                    </div>
                    <div class="content">
                        <div class="img">
                            <img :src="orderList?.order.cover" alt="">
                        </div>
                        <div class="font">{{ orderList?.order.bookName }}</div>
                        <div class="font">{{ orderList?.order.count }}张</div>
                        <div class="font">￥{{ orderList?.order.price }}</div>
                    </div>
                </div>
                <div class="address">
                    <div class="h1">订单信息</div>
                    <div style="display: flex;">
                        <div class="font">收货地址：</div>
                        <div class="address-item font" v-for="(item) in address" :key="item">{{ item }}</div>
                    </div>
                </div>
                <div class="font">联系人：{{orderList?.order.nickname}}</div>
                <div class="font">联系电话：{{orderList?.order.phoneNumber}}</div>
            </div>
        </pageComponent>
    </div>
</template>

    
<style scoped lang="scss">
.mouse:hover {
    /* 将鼠标指针变为手形 */
    cursor: pointer;
}
.box-author {
    width: 64vw;
    height: 83vh;

    .main {
        margin-top: 20px;
        .item {
            border: 1px solid #E3E5E7;

            .nav {
                display: flex;
                background: rgb(227, 229, 231);
                border-radius: 3%;
                color: #9499A0;
                align-items: center;
                padding: 20px;

                .time {
                    margin-right: 50px;
                }

                .state {
                    margin-left: auto;
                }

            }

            .content {
                margin-top: 20px;
                display: flex;
                padding: 20px;
                align-items: center;
                justify-content: space-between;

                .img {
                    img {
                        width: 5vw;
                        height: 5vw;
                        border-radius: 10%;
                    }
                }

                .font {
                    font-size: 30px;
                }

                :deep(.el-button) {
                    font-size: 30px;
                    padding: 30px;
                }
            }
        }

        .address{
            margin-top: 20px;
            .h1{
                font-size: 30px;
            }
            .address-item{
               margin-right: 20px;
            }
        }
        .font{
                font-size: 20px;
                margin-top: 20px;
            }

    }
}</style>
