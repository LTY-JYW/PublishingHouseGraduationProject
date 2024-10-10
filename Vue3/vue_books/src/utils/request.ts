import axios from 'axios'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import router from '@/router'

const baseURL =
  'http://127.0.0.1'
const userStore = useUserStore()

const instance = axios.create({
  baseURL,
  timeout: 10000
  // TODO 1. 基础地址，超时时间
})

instance.interceptors.request.use(
  (config) => {
    // TODO 2. 携带token
    if (userStore.token) {
      config.headers.Authorization = userStore.token
    }
    return config
  },
  (err) => Promise.reject(err)
)

instance.interceptors.response.use(
  (res) => {
    // TODO 3. 处理业务失败
    // TODO 4. 摘取核心响应数据
    //请求成功
    if (res.data.code === 0) {
      if ('data' in res.data) {
        if ('value' in res.data.data || res.config.method == 'get') {
          return res
        }
        ElMessage.success(res.data.message)
        return res
      } else {
        ElMessage.success(res.data.message)
        return res
      }
    }
    if (res.status !== 200) {
      ElMessage.error(
        res.data.message || '服务器响应异常'
      )
      return Promise.reject(res.data)
    }
    ElMessage.error(
      res.data.message || '服务器响应异常'
    )
    return Promise.reject(res.data)
  },
  (err) => {
    // TODO 5. 处理401错误
    if (err.response?.status === 401) {
      ElMessage.error('请登录！')
      router.push('/login')
      return Promise.reject(err)
    }
    ElMessage.error(err.message || '服务器响应异常')
    return Promise.reject(err)
  }
)
export default instance
export { baseURL }
