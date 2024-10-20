<script lang="ts" setup>
import { ref } from 'vue'
// 导入API
import { userUpPWDAPI } from '@/api/user'
import { auditUpPwdAPI} from '@/api/audit'
// 导入API类型
import type { UserInfoType } from '@/api/user'
// 导入el组件
import { ElMessage } from 'element-plus'
// 导入el类型
import type { FormRules, FormInstance } from 'element-plus'
// 导入默认头像
import { URLAVATAR } from '@/utils/default'
// 导入pinia
import { useUserStore } from '@/stores/user'
// 导入公共函数
import { forgetThePassword } from '@/utils/funtion'

// 使用pinan
const userStore = useUserStore()

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
        await userUpPWDAPI(formData.value)
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
  <div class="box-pwd">
  <pageComponent title="修改密码">

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
        <a href="" @click="forgetThePassword">忘记密码？</a>
  </pageComponent>
</div>

</template>
    
<style scoped>
.box-pwd {
    width: 64vw;
    height: 83vh;
    .main {
    }
}
</style>