<script lang="ts" setup>
import { ref } from 'vue'
// 导入后端交互函数
import { auditGetOveryApi,auditRegisterAPI } from '@/api/audit'
// 导入默认头像地址
import { URL } from '@/utils/defaultAvatar'
// 导入el图标
import { User, Lock } from '@element-plus/icons-vue'
// 导入el组件
import { ElMessage } from 'element-plus'
// 导入el 数据类型
import type { FormProps } from 'element-plus'
// 导入后端数据类型
import type { AuditOveryValueType } from '@/api/audit'

// 当前页码
const page = ref(1)
// 每页显示条数
const itemsPerPage = ref(10)
// 表格数据
const tableDate = ref<AuditOveryValueType>()
// 数据总条数
const total = ref<number>(0)
// 是否为加载状态
const loading = ref<boolean>(false)
// 添加审核员状态弹窗显示隐藏
const isDialog = ref<boolean>(false)
// 表单返回数据
const formData = ref({
  username: '',
  password: '',
  repassword:''
})
// 表单对齐方式
const labelPosition = ref<FormProps['labelPosition']>('left') 

// 确认密码自定义校验规则
const rePassWordModel = (
  rule:any,
  value:any,
  callback:any
) => {
  if (formData.value.password !== value) {
    callback(new Error('两次输入的密码不一致！'))
  }
  callback()
}

// 表单校验规则
const rules = {
  username: [
    {
      required: true,
      message: '请输入账号！',
      trigger: 'blur'
    },
    {
      min: 1,
      max: 10,
      message: '用户名在1——10个字符内',
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      message: '请输入密码！',
      trigger: 'blur'
    },
    {
      pattern: /^\S{6,15}$/,
      message: '密码为6——15位非空字符！',
      trigger: 'blur'
    }
  ],
  repassword: [
    {
      required: true,
      message: '请确认密码！',
      trigger: 'blur'
    },
    {
      validator: rePassWordModel,
      trigger: 'blur'
    }
  ]
}

// 获取审核员列表函数
const getList = async () => {
  loading.value = true
  const res = await auditGetOveryApi(page.value, itemsPerPage.value)
  if (res.data.data === undefined) {
    tableDate.value = undefined
    loading.value = false
    return
  }
  tableDate.value = res.data.data.value
  total.value = res.data.data.count
  loading.value = false
}

// 一开始便调用函数获取表格数据
await getList()


// 改变页码和每页条数的函数 
const onChange = async (currentPage: number, pageSize: number) => {
  if (itemsPerPage.value === pageSize) {
    page.value = currentPage
    await getList()
  } else {
    page.value = 1
    itemsPerPage.value = pageSize
    await getList()
  }
}
// 添加审核员弹窗确认函数
const onConfirm = async () => {
  const res = await auditRegisterAPI({
    username:formData.value.username,
    password:formData.value.password
  })
  if (res.data.code != 0) {
    ElMessage.error(res.data.message)
  }else{
    formData.value = {
      username:'',
      password:'',
      repassword:''
    }
    isDialog.value = false
    ElMessage.success("添加成功")
    await getList()
  }
}

</script>

<template>
  <pageComponent title="审核员管理">
    <template #button>
      <el-button plain type="primary" round @click="isDialog = true">添加审核员</el-button>
    </template>
    <el-table stripe style="width: 100%" :data="tableDate" v-loading="loading" height="680">
      <el-table-column label="头像" width="180">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <el-avatar :src='scope.row.date' v-if="scope.row.date" />
            <el-avatar :src='URL' v-else />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="nickname" label="昵称" />
      <el-table-column prop="username" label="账号" width="180" />
    </el-table>
    <!-- 分页部分 -->
    <div class="pagination">
      <el-pagination v-model:current-page="page" v-model:page-size="itemsPerPage" :page-sizes="[1, 5, 10, 15]"
        :background="true" layout="jumper, total, sizes, prev, pager, next" :total="total" @change="onChange" />
    </div>

    <!-- 添加审核员弹窗 -->
    <el-dialog v-model="isDialog" title="添加审核员" width="500" draggable overflow>

      <!-- 表单部分 -->
      <el-form inline :model="formData" :rules="rules" ref="form" size="large" autocomplete="off" :label-position="labelPosition">
        <el-form-item prop="username" label="账号" label-position="left">
          <el-input v-model="formData.username" :prefix-icon="User" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码" label-position="left">
          <el-input v-model="formData.password" :prefix-icon="Lock" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item prop="repassword" label="确认密码" label-position="left">
          <el-input
          v-model="formData.repassword"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入再次密码"
          ></el-input>
        </el-form-item>
      </el-form>

      <!-- 底部按钮部分 -->
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="isDialog = false">取消</el-button>
          <el-button type="primary" @click="onConfirm">
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>
  </pageComponent>
</template>  

<style scoped>
.el-form{
  justify-content: space-between;
}
</style>