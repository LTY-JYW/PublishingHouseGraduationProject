<script lang="ts" setup>
import { ref, computed } from 'vue'
// 导入API
import { cartGetListAPI, cartUpNumAPI, cartDelAPI } from '@/api/cart'
import { orderAddAPI } from '@/api/order'
// 导入API类型
import type { CartListType, UpNumType } from '@/api/cart'
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

// 空遍历
const isNull = ref(false)
// 加载变量
const loading = ref(true)
// 分页变量
const page = ref<PageType>({
    page: 1,
    itemsPerPage: 5
})
// 订单列表变量
const cartList = ref<CartListType>()
// 总数变量
const count = ref<number>()
// 获取订单列表函数
const getList = async () => {
    const { data: { data } } = await cartGetListAPI(page.value)
    if (data.value.length < 1) {
        isNull.value = true
    }
    cartList.value = data.value
    count.value = data.count
    loading.value = false
}
await getList()

// 复选框变量
const checkList = ref<number[]>([])
// 控制全选复选框的选中状态
const checkAll = ref<boolean>(false);
// 控制全选复选框的中间状态（部分选中）
const isIndeterminate = ref<boolean>(false);
const names = cartList.value!.map(item => item.bid)

const handleCheckAllChange = () => {
    if (checkAll.value) {
        checkList.value = names
    } else {
        checkList.value = []
    }
}
const handleCheckedCitiesChange = () => {
    if (checkList.value.length <= 0) {
        checkAll.value = false
    } else if (checkList.value.length == names.length) {
        checkAll.value = true
    }
    if (checkList.value.length > 0 && checkList.value.length < names.length) {
        isIndeterminate.value = true
    } else {
        isIndeterminate.value = false
    }
}


// 加数量
const add = async (id: number, count: number) => {
    const num = count + 1
    await cartUpNumAPI({ id, count: num })
    await getList()
}
// 见数量
const minus = async (id: number, count: number) => {
    const num = count - 1
    await cartUpNumAPI({ id, count: num })
    await getList()

}

// 计算属性，用于计算所有对象value属性的总和
const totalValue = computed(() => {
    const sumList = cartList.value?.filter(item => checkList.value.includes(item.bid))
    return sumList?.reduce((sum, item) => {
        sum += (item.price * item.count)
        return sum
    }, 0)
})

// 结算订单
const settlement = async () => {
    const a = cartList.value?.filter(item => checkList.value.includes(item.bid))

    if (checkList.value.length <= 0) {
        ElMessage.error('未选择商品！')
    }
    for (const item in a) {
        console.log(a[Number(item)]);
        await orderAddAPI(a[Number(item)].bid, a[Number(item)].count)
        await cartDelAPI(a[Number(item)].id)
    }
    await getList()

}

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
    <div class="box-cart">
        <pageComponent title="订单">
            <div v-if="!isNull" class="main">
                <!-- 表格部分 -->
                <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate"
                    @change="handleCheckAllChange">全选</el-checkbox>
                <el-checkbox-group v-model="checkList" @change="handleCheckedCitiesChange">
                    <div class="item" v-for="item in cartList" :key="item.id">
                        <el-checkbox class="aaa" :value="item.bid" />
                        <div class="item-img"><img :src="item.cover" alt=""></div>
                        <div class="font">
                            <div class="name">{{ item.name }}</div>
                            <div style="display: flex; width: 45vw;justify-content: space-between;">
                                <div class="price"> ￥ {{ item.price * item.count }}</div>
                                <div class="num">
                                    <el-icon class="add mouse" @click="add(item.id, item.count)">
                                        <Plus />
                                    </el-icon>
                                    {{ item.count }}
                                    <el-icon class="minus mouse" @click="minus(item.id, item.count)">
                                        <Minus />
                                    </el-icon>
                                </div>
                            </div>

                        </div>
                    </div>
                </el-checkbox-group>
            </div>
            <div v-if="!isNull" class="pagination">
                <el-pagination v-model:current-page="page.page" v-model:page-size="page.itemsPerPage" :page-sizes="[1, 5, 10, 15]"
                    :background="true" layout="jumper, total, sizes, prev, pager, next" :total="count" @change="onChange" />
            </div>
            <div v-if="!isNull" class="foot">
                <div class="count">
                    合计：￥{{ totalValue }}
                </div>
                <div class="button"><el-button class="bu" type="danger" round @click="settlement">去结算</el-button></div>
            </div>
            <div v-if="isNull">暂无购物车信息</div>
        </pageComponent>
    </div>
</template>

    
<style scoped lang="scss">
.mouse:hover {
    /* 将鼠标指针变为手形 */
    cursor: pointer;
}

.box-cart {
    width: 64vw;
    height: 83vh;

    .main {
        margin-left: 20px;

        .item {
            display: flex;
            margin-bottom: 30px;


            :deep(.el-checkbox__inner) {
                width: 40px;
                height: 40px;
                border-radius: 50%;
            }

            :deep(.el-checkbox) {
                margin-top: 6%;
                margin-right: 20px;
            }

            .item-img {

                img {
                    width: 8vw;
                }
            }

            .font {
                display: flex;
                justify-content: space-between;
                flex-direction: column;
                margin-left: 50px;
                padding-top: 30px;

                .name {
                    font-size: 50px;
                }

                .price {
                    font-size: 40px;
                    color: red;
                    display: flex;
                    align-content: stretch;
                    justify-content: center;
                    align-items: center;
                }

                .num {
                    display: flex;
                    font-size: 40px;
                    justify-content: space-between;
                    align-items: center;
                    // margin-left: 500px;

                    .add {
                        margin-right: 50px;
                        border: 1px solid;
                        border-radius: 50%;
                        padding: 5px;
                    }

                    .minus {
                        margin-left: 50px;
                        border: 1px solid;
                        border-radius: 50%;
                        padding: 5px;
                    }
                }
            }
        }
    }

    .foot {
        display: flex;
        justify-content: space-between;
        padding: 20px;
        font-size: 30px;

        .button {
            padding-right: 3vw;

            .bu {
                font-size: 30px;
                padding: 10px;
            }
        }
    }
}
</style>
