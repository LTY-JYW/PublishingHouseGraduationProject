<script lang="ts" setup>
import { ref } from 'vue'
// 导入API
import { adminGetInfoApi, adminUpPwdAPI } from '@/api/admin'
import { auditGetInfo,auditUpPwdAPI} from '@/api/audit'
// 导入API类型
import type { AdminGetInfoType } from '@/api/admin'
// 导入el组件
import { ElMessage } from 'element-plus'
// 导入el类型
import type { FormRules, FormInstance } from 'element-plus'
// 导入默认头像
import { URL } from '@/utils/defaultAvatar'
// 导入pinia
import { useUserStore } from '@/stores/user'

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
// 修改密码类型
type adminUpPwdtype = {
  oldPwd: string
  newPwd: string
  resPwd: string
}
// 修改管理员详细信息变量
const formData = ref<adminUpPwdtype>({
  oldPwd: '',
  newPwd: '',
  resPwd: ''
})
//注册确认密码校验函数
const validateRepassword = (rule: any, value: any, callback: any) => {
  if (formData.value.newPwd !== value) {
    callback(new Error('两次输入的密码不一致！'))
  }
  callback()
}
// 修改管理员信息校验规则
const formDataRules: FormRules<adminUpPwdtype> = {
  oldPwd: [
    {
      required: true,
      message: '请输入密码！',
      trigger: 'blur'
    },
    {
      pattern: /^[\S]{6,12}$/,
      message: '密码为6——12位非空字符！',
      trigger: 'blur'
    }
  ],
  newPwd: [
    {
      required: true,
      message: '请输入密码！',
      trigger: 'blur'
    },
    {
      pattern: /^[\S]{6,12}$/,
      message: '密码为6——12位非空字符！',
      trigger: 'blur'
    }
  ],
  resPwd: [
    {
      required: true,
      message: '请输入密码！',
      trigger: 'blur'
    },
    {
      pattern: /^[\S]{6,12}$/,
      message: '密码为6——12位非空字符！',
      trigger: 'blur'
    },
    {
      validator: validateRepassword,
      trigger: 'blur'
    }
  ]
}
// 确认修改管理员信息函数
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      if (isAdmin.value) {
        await adminUpPwdAPI(formData.value)
      }else{
        await auditUpPwdAPI(formData.value)
      }
      await getAdminInfo()

    } else {
      ElMessage.error('请填写完整表单数据')
    }
  })
}
// 取消修改
const clearForm = () => {
  formData.value = {
    oldPwd: '',
    newPwd: '',
    resPwd: ''
  }
}
</script>
<template>
  <pageComponent title="修改密码">
    <el-row justify="center" class="elRowS">
      <el-col :span="3" :offset="0"><el-avatar class="avatar" :size="200" :src="adminInfoData[0].avatar?adminInfoData[0].avatar:URL" /></el-col>
    </el-row>
    <el-row justify="center" class="elRowS">
      <el-col :span="1">{{ adminInfoData[0].nickname }}</el-col>
    </el-row>
    <el-row justify="center" class="elRowS">
      <el-col :span="6">
        <el-form size="large" autocomplete="off" :model="formData" :rules="formDataRules" ref="ruleFormRef">
          <!-- 表单数据区域 -->
          <el-form-item prop="oldPwd" label="原始密码">
            <el-input placeholder="请输入原密码" v-model="formData.oldPwd" />
          </el-form-item>
          <el-form-item prop="newPwd" label="更换密码">
            <el-input placeholder="请输入新密码" v-model="formData.newPwd" type="password" show-password />
          </el-form-item>
          <el-form-item prop="resPwd" label="确认密码">
            <el-input placeholder="请确认密码" v-model="formData.resPwd" type="password" show-password />
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