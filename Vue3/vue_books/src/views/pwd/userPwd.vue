<script lang="ts" setup>
import { ref, computed } from 'vue'
// 导入API
import { userUpPWDAPI, userForgetPWDAPI } from '@/api/user'
import { emailAPI } from '@/api/email'
// 导入API类型
import type { UserInfoType, UserForgetPwd } from '@/api/user'
import type { EmailType } from '@/api/email'
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

// 表单类型
type DateType = {
  password: string
  repassword: string
  recipient: string
  verificationCode: string
}
// 修改管理员详细信息变量
const formData = ref<DateType>({
  recipient: '',
  verificationCode: '',
  password: '',
  repassword: ''
})

//注册确认密码校验函数
const validateRepassword = (rule: any, value: any, callback: any) => {
  if (formData.value.password !== value) {
    callback(new Error('两次输入的密码不一致！'))
  }
  callback()
}

// 修改管理员信息校验规则
const formDataRules: FormRules<DateType> = {
  password: [
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
  repassword: [
    {
      required: true,
      message: '请输入密码！',
      trigger: 'blur'
    },
    {
      validator: validateRepassword,
      trigger: 'blur'
    }
  ],
  recipient: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
  ],
  verificationCode: [
    { required: true, message: '请输入验证码', trigger: 'blur' },

  ],
}

// 确认修改管理员信息函数
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      await userForgetPWDAPI({
        newPwd: formData.value.password,
        verificationCode: formData.value.verificationCode
      })

    } else {
      ElMessage.error('请填写完整表单数据')
    }
  })
}

// 取消修改
const clearForm = () => {
  formData.value = {
    password: '',
    repassword: '',
    recipient: '',
    verificationCode: ''
  }
}


const timer = ref<number>(60); // 验证码计时器的初始值
const isDisabled = ref<boolean>(false); // 控制按钮是否可点击
let intervalId: number | null = null; // 用于存储计时器的 ID

const timerText = computed<string>(() => {
  return timer.value > 0 ? `${timer.value}秒后重发` : '发送验证码';
});

const startTimer = async () => {
  if (intervalId !== null) return; // 如果计时器已经在运行，则不再启动新的计时器

  isDisabled.value = true; // 禁用按钮
  timer.value = 60; // 重置计时器
  await emailAPI(formData.value.recipient)
  intervalId = window.setInterval(() => {
    if (timer.value > 0) {
      timer.value -= 1; // 每秒减一
    } else {
      if (intervalId) {
        window.clearInterval(intervalId); // 计时器到零时清除
        intervalId = null; // 重置 intervalId
      }
      isDisabled.value = false; // 启用按钮
    }
  }, 1000);
};


// 发送邮件函数
const sendEmail = async () => {
  isDisabled.value = true
  setTimeout(() => {

  }, 60);
}

</script>
<template>
  <a href="http://localhost:5173/login">
  <span>返回登录</span>
  </a>
  <div class="pwd">
    <div class="font">忘记密码</div>
    <el-form size="large" autocomplete="off" :model="formData" :rules="formDataRules" ref="ruleFormRef">
      <!-- 表单数据区域 -->
      <el-form-item prop="oldPwd" label="邮箱地址">
        <el-input placeholder="请输入邮箱" v-model="formData.recipient" />
      </el-form-item>
      <el-form-item prop="oldPwd" label="验证码">
        <el-input style="width: 18vw;" placeholder="请输入验证码" v-model="formData.verificationCode" />
        <el-button type="primary" round @click="startTimer" :disabled="isDisabled">{{ timerText }}</el-button>
      </el-form-item>
      <el-form-item prop="newPwd" label="更换密码">
        <el-input placeholder="请输入新密码" v-model="formData.password" type="password" show-password />
      </el-form-item>
      <el-form-item prop="repassword" label="确认密码">
        <el-input placeholder="请确认密码" v-model="formData.repassword" type="password" show-password />
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
  </div>
</template>
    
<style scoped>
.pwd {
  width: 30vw;
  height: 100vh;
  margin: auto;
  margin-top: 10vw;

  .font {
    font-family: '程荣光刻楷', sans-serif;
    font-size: 50px;
    margin-bottom: 20px;
  }

  :deep(.is-round) {
    margin-left: 30px;
  }
}
</style>