<script lang="ts" setup>
import { ref } from 'vue'
// 导入API
import { adminGetInfoApi, adminUpInfoAPI } from '@/api/admin'
import { auditGetInfo, auditUpInfoAPI } from '@/api/audit'
// 导入API类型
import type { AdminGetInfoType } from '@/api/admin'
// 导入el组件
import { ElMessage } from 'element-plus'
// 导入el类型
import type { FormRules, FormInstance } from 'element-plus'
// 导入pinia
import { useUserStore } from '@/stores/user'
// 导入默认头像
import { URLAVATAR } from '@/utils/default'

// 使用pinan
const userStore = useUserStore()
// 判断管理员和审核员变量
const isAdmin = ref<boolean>()
if (userStore.permissions === 0) {
  isAdmin.value = true
} else if (userStore.permissions === 1) {
  isAdmin.value = false
}
// 管理员详细信息变量
const adminInfoData = ref<AdminGetInfoType>([{
  id: 1,
  username: '',
  nickname: '',
  avatar: ''
}])

// 获取管理员详细信息函数
const getAdminInfo = async () => {
  if (isAdmin.value) {
    const { data } = await adminGetInfoApi()
    adminInfoData.value = data.data
  } else {
    const { data } = await auditGetInfo()
    adminInfoData.value = data.data
  }
}
// 调用函数获取管理员详细信息
await getAdminInfo()

// 表单变量
const ruleFormRef = ref()
// 表单提交类型
type formDataType = {
  nickname: string
}
// 修改管理员详细信息变量
const formData = ref<formDataType>({
  nickname: ''
})
// 修改管理员信息校验规则
const formDataRules: FormRules<formDataType> = {
  nickname: [
    {
      required: true,
      message: '请选择分类',
      trigger: 'blur'
    }
  ]
}
// 确认修改管理员信息函数
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      if (isAdmin.value) {
        await adminUpInfoAPI(formData.value)
      }else{
        await auditUpInfoAPI(formData.value)
      }
      await getAdminInfo()
    } else {
      ElMessage.error(`'error submit!'${fields}`)
    }
  })
}
// 取消修改
const clearForm = () => {
  formData.value = {
    nickname: ''
  }
}
</script>
<template>
  <pageComponent title="修改资料">
    <el-row justify="center" class="elRowS">
      <el-col :span="3" :offset="0"><el-avatar class="avatar" :size="200"
          :src="adminInfoData[0].avatar || URLAVATAR" /></el-col>
    </el-row>
    <el-row justify="center" class="elRowS">
      <el-col :span="1">{{ adminInfoData[0].nickname }}</el-col>
    </el-row>
    <el-row justify="center" class="elRowS">
      <el-col :span="6">
        <el-form size="large" autocomplete="off" :model="formData" :rules="formDataRules" ref="ruleFormRef">
          <!-- 表单数据区域 -->
          <el-form-item prop="nickname" label="昵称">
            <el-input placeholder="请输入昵称" v-model="formData.nickname"></el-input>
          </el-form-item>
          <!-- 表单按钮区域 -->
          <el-form-item>
            <div class="el-button-admin-form">
              <el-button class="button" type="primary" auto-insert-space @click="submitForm(ruleFormRef)">
                确认
              </el-button>
              <el-button class="button" type="info" auto-insert-space @click="clearForm()">
                重置
              </el-button>
            </div>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

  </pageComponent>
</template>
    
<style scoped>
.el-row {
  margin-top: 50px;
}

.el-button-admin-form {
  margin: auto;
  margin-top: 50px;
  width: 100%;
  justify-content: space-between;
}

.el-button--info {
  float: right;
}
</style>