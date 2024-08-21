<script setup lang="ts">
import { ref } from "vue";
const isRegister = ref(true)
import { User, Lock } from '@element-plus/icons-vue'
import type { FormRules, FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { userRegisterAPI,userLoginAPI } from '@/api/user'
import router from '@/router/index'
import { useUserStore } from '@/stores/user'
import type { UserLoginType } from '@/api/user'
import type { ResType } from '@/api/results'
const userStore = useUserStore()
// 表单类型
type DateType = {
  username: string
  password: string
  repassword: string
}

// 表单变量
const formDate = ref<DateType>({
  username: '',
  password: '',
  repassword: ''
})

//注册确认密码校验函数
const validateRepassword = (rule: any, value: any, callback: any) => {
  if (formDate.value.password !== value) {
    callback(new Error('两次输入的密码不一致！'))
  }
  callback()
}

// 校验规则
const rules: FormRules<DateType> = {
  username: [
    {
      required: true,
      message: '请输入用户名！',
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
      message: '请输入密码！',
      trigger: 'blur'
    },
    {
      validator: validateRepassword,
      trigger: 'blur'
    }
  ]
}

// 注册请求函数
const Register = async () => {
  await userRegisterAPI(formDate.value)
  ElMessage.success('注册成功！')
}

// 获取表单数据变量
const ruleFormRef = ref<FormInstance>()

// 注册提交逻辑
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log(fields);
      Register()
    } else {
      ElMessage.error('出现异常错误请稍后再试')
    }
  })
}

// 登录请求函数
const Login = async () => {
  const res:ResType<UserLoginType> = await userLoginAPI(formDate.value)
  console.log(res.data);
  userStore.setToken(res.data.token)
  ElMessage.success('登录成功！')
  router.push('/user')
}
// 登录按钮逻辑
const submitLogin = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      Login()
    } else {
      ElMessage.error('出现异常错误请稍后再试')
    }
  })
}

</script>

<template>
  <el-row class="login-page">
    <el-col :span="12" class="bg"></el-col>
    <el-col :span="6" :offset="3" class="form">
      <!-- 注册模块 -->
      <el-form ref="ruleFormRef" size="large" autocomplete="off" v-if="isRegister" :model="formDate" :rules="rules">
        <el-form-item>
          <h1>注册</h1>
        </el-form-item>
        <!-- 表单数据区域 -->
        <el-form-item prop="username">
          <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="formDate.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input :prefix-icon="Lock" type="password" placeholder="请输入密码" v-model="formDate.password"></el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input :prefix-icon="Lock" type="password" placeholder="请输入再次密码" v-model="formDate.repassword"></el-input>
        </el-form-item>
        <!-- 表单按钮区域 -->
        <el-form-item>
          <el-button class="button" type="primary" auto-insert-space @click="submitForm(ruleFormRef)">
            注册
          </el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = false">
            ← 返回
          </el-link>
        </el-form-item>
      </el-form>
      <!-- 登录模块 -->
      <el-form ref="ruleFormRef" size="large" autocomplete="off" v-else :model="formDate" :rules="rules">
        <el-form-item>
          <h1>登录</h1>
        </el-form-item>
        <!-- 表单数据区域 -->
        <el-form-item prop="username">
          <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="formDate.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input name="password" :prefix-icon="Lock" type="password" placeholder="请输入密码"
            v-model="formDate.password"></el-input>
        </el-form-item>
        <!-- 表单按钮区域 -->
        <el-form-item class="flex">
          <div class="flex">
            <el-checkbox>记住我</el-checkbox>
            <el-link type="primary" :underline="false">忘记密码？</el-link>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button class="button" type="primary" auto-insert-space @click="submitLogin(ruleFormRef)">登录</el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = true">
            注册 →
          </el-link>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.login-page {
  height: 100vh;
  background-color: #fff;

  .bg {
    background:

      url('@/assets/login_bg.jpg') no-repeat center / cover;
  }

  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;

    .title {
      margin: 0 auto;
    }

    .button {
      width: 100%;
    }

    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
