<script lang="ts" setup>
import { ref } from 'vue'
// 导入API
import { orderSelAPI } from '@/api/order'
import { uploadsFileWordAPI } from '@/api/uploads'
// 导入API类型
import type { OrderSelType } from '@/api/order'
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

// 加载变量
const loading = ref(true)
// 分页变量
const page = ref<PageType>({
    page: 1,
    itemsPerPage: 3
})
const count = ref(0)
// 订单列表变量
const orderList = ref<OrderSelType>()
// 获取订单列表函数
const getList = async () => {
    const { data: { data } } = await orderSelAPI(page.value)
    if (data.value.length < 1) {
        orderList.value = undefined
        loading.value = false
        return
    }
    orderList.value = data.value
    count.value = data.count
    loading.value = false
}
await getList()


// 改变页码和每页条数的函数 
const onChange = async (currentPage: number, pageSize: number) => {
  if (page.value.itemsPerPage === pageSize) {
    page.value.page = currentPage
    await getList()
  } else {
    page.value.page = 1
    page.value.itemsPerPage = pageSize
    await getList()
  }
}
</script>
<template>
    <div class="box-author">
        <pageComponent title="订单">
            <div class="main">
                <!-- 表格部分 -->
                <div class="item" v-for="item in orderList" :key="item.id">
                    <div class="nav">
                        <div class="time">创建时间：{{ formDate(item.time) }}</div>
                        <div class="id">订单号： {{ item.id }}</div>
                        <div class="state">
                            <el-tag v-if="item.shipping == 1" type="primary" effect="dark" round> 已发货 </el-tag>
                            <el-tag v-else type="danger" effect="dark" round> 未发货 </el-tag>
                        </div>
                    </div>
                    <div class="content">
                        <div class="img">
                            <img :src="item.cover" alt="">
                        </div>
                        <div class="font">{{ item.bookName }}</div>
                        <div class="font">{{ item.count }}张</div>
                        <div class="font">￥{{ item.price }}</div>
                        <div class="font"><el-button @click="onOrder(item.id)">查看订单</el-button></div>
                    </div>
                </div>
            </div>
            <div class="pagination">
                <el-pagination v-model:current-page="page.page" v-model:page-size="page.itemsPerPage" :page-sizes="[1, 5, 10, 15]"
                    :background="true" layout="jumper, total, sizes, prev, pager, next" :total="count" @change="onChange" />
            </div>
        </pageComponent>
    </div>
</template>

    
<style scoped lang="scss">
.box-author {
    width: 64vw;
    height: 83vh;

    .main {
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

    }
}</style>
