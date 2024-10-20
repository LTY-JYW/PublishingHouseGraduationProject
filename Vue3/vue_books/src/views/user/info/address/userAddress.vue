<script lang="ts" setup>
import { ref } from 'vue'
// 导入API
import { addressGetListAPI, addressAddAPI, addressUpAPI,addressDelAPI,addressPuDefAPI } from '@/api/address'
import { orderAddAPI } from '@/api/order'
// 导入API类型
import type { AddressListType } from '@/api/address'
import type { PageType } from '@/api/results'
// 导入默认头像
import { URLAVATAR, URLBG } from '@/utils/default'
// 导入el图标
import { Delete, Edit, } from '@element-plus/icons-vue'
// 导入el类型
import type { FormRules, FormInstance, UploadInstance, UploadProps, UploadFile, UploadRawFile } from 'element-plus'
// 导入el组件
import { ElMessageBox, ElMessage, genFileId } from 'element-plus'
// 导入公共函数
import { formDate } from '@/utils/dayjs'
import { onOrder } from '@/utils/funtion'
// 导入地区数据
import data from '@/assets/json.json'

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
const addressList = ref<AddressListType>()
// 总数变量
const count = ref<number>()
// 获取订单列表函数
const getList = async () => {
    const { data: { data } } = await addressGetListAPI(page.value)
    if (data.value.length < 1) {
        isNull.value = true
    }
    addressList.value = data.value
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

// 抽屉变量
const addressDialog = ref(true)
const ruleFormRef = ref()
// 确认添加资讯事件函数
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate(async (valid, fields) => {
        if (valid) {
            console.log('aaa');

        }
    })
    await getList()
    addressDialog.value = false
}

type RegionData = {
    [key: number]: {
        [key: number]: string;
    };
};
// 选择器变量省份
const region = ref<number>(1)
// 选择器变量城市
const regionCity = ref<number>(36)
// 地区变量
const regionData = ref<RegionData>(data)
// 城市变量
const regionCityData = ref<RegionData>(data[1])
// 详细地址变量
const textarea = ref('')

// 判断添加变量
const isAdd = ref(false)
// Id值
const addressId = ref(0)
// 对话框变量
const dialogVisible = ref(false)
// 选择器事件函数
const selectOnChange = () => {
    regionCityData.value = regionData.value[region.value || 0]
}

// 编辑表格
const headEdit = (id: number) => {
    dialogVisible.value = true
    isAdd.value = false
    addressId.value = id
}

// 删除表格
const headDelete = (id: number) => {
    ElMessageBox.confirm('你确定要删除这个吗？', '确认对话框', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    // 用户点击确定后的操作
    await addressDelAPI(id)
    await getList()
  }).catch(() => {
    // 用户点击取消后的操作
  });
}

// 添加地址函数
const addAddress = () => {
    dialogVisible.value = true
    isAdd.value = true
}

// 添加地址确认
const confirm = async () => {
    const addressProvince = regionData.value[0][region.value]
    const addressCity = regionCityData.value[regionCity.value || 0]
    const str = `${addressProvince},${addressCity},${textarea.value}`

    console.log(isAdd.value);
    
    if (isAdd.value) {
        await addressAddAPI(str)

    } else {
        await addressUpAPI({
            id:addressId.value,
            address:str
        })
    }
    await getList()

    dialogVisible.value = false

}

// 设置默认地址函数
const addressDef = async (id:number) => {
    await addressPuDefAPI(id)
    await getList()
}

</script>
<template>
    <div class="box-cart">
        <pageComponent title="我的收货地址">
            <template #button>
                <el-button plain type="primary" round @click="addAddress">添加地址</el-button>
            </template>
            <!-- 表格部分 -->
            <el-table stripe style="width: 100%" :data="addressList" v-loading="loading" height="680" table-layout="auto">
                <el-table-column prop="uValue" label="收货人" />
                <el-table-column prop="phoneNumber" label="联系方式" />
                <el-table-column label="所在地区">
                    <template #default="scope">
                        <div style="display: flex;">
                            <div style="padding-right:0.5vw;" v-for="item in scope.row.address.split(',').slice(0, 2)"
                                :key="item">{{ item }}</div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="详细地址">
                    <template #default="scope">
                        <div v-for="item in scope.row.address.split(',').slice(2, 10)" :key="item">{{ item }}</div>
                    </template>
                </el-table-column>
                <!-- 表格操作部分 -->
                <el-table-column label="操作" class="table_operation" width="50px">
                    <template #default="scope">
                        <el-button-group>
                            <el-button type="primary" :icon="Edit" circle plain @click="headEdit(scope.row.id)"
                                class="table_operation_button" size="large" />
                            <el-button type="danger" :icon="Delete" circle plain @click="headDelete(scope.row.id)"
                                class="table_operation_button" size="large" />
                        </el-button-group>
                    </template>
                </el-table-column>
                <el-table-column label="移动设置">
                    <template #default="scope">
                        <el-tag v-if="scope.row.default == 1" type="primary" effect="dark" round> 默认地址 </el-tag>
                        <el-tag v-else type="info" effect="dark" round @click="addressDef(scope.row.id)"> 设为默认 </el-tag>
                    </template>
                </el-table-column>
            </el-table>

            <el-dialog v-model="dialogVisible" title="Tips" width="500">
                <!-- 头部 -->
                <template #header>
                    <div class="my-header">
                        <h1 v-if="isAdd">添加地址</h1>
                        <h1 v-else>编辑地址</h1>
                    </div>
                </template>
                <!-- 内容 -->
                <!-- 省份 -->
                省份：
                <el-select v-model="region" placeholder="" size="large" style="width: 240px" @change="selectOnChange">
                    <el-option v-for="(item, index) in regionData[0]" :key="item" :label="item" :value="Number(index)" />
                </el-select>
                <!-- 城市 -->
                <br>城市：
                <el-select v-model="regionCity" placeholder="请选择" size="large" style="width: 240px">
                    <el-option v-for="(item, index) in regionCityData" :key="item" :label="item" :value="Number(index)" />
                </el-select>
                <el-input class="input" v-model="textarea" style="width: 100%" :rows="2" type="textarea"
                    placeholder="请输入详细地址" />
                <!-- 底部 -->
                <template #footer>
                    <div class="dialog-footer">
                        <el-button @click="dialogVisible = false">取消</el-button>
                        <el-button type="primary" @click="confirm">
                            确认
                        </el-button>
                    </div>
                </template>
            </el-dialog>
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

    .input {
        margin-top: 20px;
    }
}
</style>
