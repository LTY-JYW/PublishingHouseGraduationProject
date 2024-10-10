<script lang="ts" setup>
import { ref } from 'vue'
// 导入API
import { booksGetInfoAPI } from '@/api/books'
// 导入API类型
import type { BookInfoType } from '@/api/books'

// 导入路由
import { useRoute } from 'vue-router'

const route = useRoute()
// 图书Id
const bookId: number = Number(route.query.id)
// 图书信息变量
const tableData = ref<BookInfoType>()
// 获取图书详细信息函数
const getInfo = async () => {
    const { data: { data } } = await booksGetInfoAPI(bookId)
    tableData.value = data
}
await getInfo()

// 姓名变量
const inName = ref('')
// 联系电话变量
const inNumber = ref('')
// 搜索框取消图标触发函数
const onClear = async () => {
    inName.value = ''
    inNumber.value = ''
}
</script>
<template>
    <div class="box">
        <div class="nav"><span>订单信息</span></div>
        <div class="table">
            <el-table :data="tableData" style="width: 100%" table-layout="auto">
                <el-table-column label="商品" width="350px" :align="'center'">
                    <template #default="scope">
                        <div class="table-item">
                            <img :src='scope.row.cover' />
                            <div>
                                <span class="table-item-title">{{ scope.row.name }}</span><br>
                                <div class="table-item-profile">{{ scope.row.profile }}</div>
                            </div>
                        </div>

                    </template>
                </el-table-column>

                <el-table-column prop="price" label="价格" :align="'center'">
                    <template #default="scope">
                        <span> ￥{{ scope.row.price }} </span>
                    </template>
                </el-table-column>
                <el-table-column label="数量" :align="'center'">
                    <span> 1 本</span>
                </el-table-column>
                <el-table-column label="合计" :align="'center'">
                    <template #default="scope">
                        <span class="total"> ￥{{ scope.row.price }} （不含运费） </span>
                    </template>
                </el-table-column>

            </el-table>
        </div>
        <div class="nav"><span style="font-weight: bold;">联系人</span></div>
        <div class="info">
            <el-form label-position="right" label-width="auto">
                <el-form-item label="姓名">
                    <el-input v-model="inName" placeholder="请输入联系人姓名" clearable @clear="onClear" size="large"
                        class="info-input" />
                </el-form-item>
                <el-form-item label="联系电话">
                    <el-input v-model="inNumber" placeholder="请输入联系人手机号" clearable @clear="onClear" size="large"
                        class="info-input" />
                </el-form-item>
            </el-form>
        </div>
        <div class="payment">
            <div class="lumpSum">
                <span>商品总额</span> <span>￥{{ tableData![0].price }}</span>
            </div>
            <div class="amountPayable">
                <span>应付金额</span> <span class="redFont">￥{{ tableData![0].price }}</span>
            </div>
        </div>
        <div class="confirmPayment">
            <el-button color="#FF6699">下一步支付，￥{{ tableData![0].price }}</el-button>
        </div>
    </div>
</template>
    
<style lang="scss" scoped>
.box {
    margin-top: 30px;
    background: white;

    .nav {
        font-size: 20px;
        padding: 20px;
        margin-top: 20px;
    }

    .table {
        width: 90%;
        margin: auto;

        .table-item {
            display: flex;
            .table-item-title{
                font-size: 20px;
                margin-bottom: 20px;
            }
            .table-item-profile{
                height: 10px;
            }
        }

        img {
            height: 100px;
        }

        ::v-deep .el-table th {
            background: #F6F7F8;
        }

        .total {
            color: red;
        }
    }

    .info {
        padding: 50px;

        .info-input {
            width: 400px;
        }
    }

    @mixin payment-span {
        font-size: 18px;
        width: 200px;
        margin-left: auto;
        display: flex;
        justify-content: space-between;
    }

    .payment {
        background: #F6F7F8;
        position: relative;
        text-align: right;
        padding: 20px;
        width: 90%;
        margin: auto;

        .lumpSum {
            margin-bottom: 10px;
            @include payment-span;

        }

        .amountPayable {
            @include payment-span;

            .redFont {
                color: #FF6699;
                font-size: 23px;
            }
        }
    }

    .confirmPayment {
        margin-left: auto;
        margin-top: 20px;
        padding-bottom: 50px;
        width: 250px;

        button {
            padding: 30px;
            color: white;
            font-size: 18px;
        }
    }

}</style>