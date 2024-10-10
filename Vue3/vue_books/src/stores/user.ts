import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('counter', () => {
  // token
  const token = ref(localStorage.getItem('TOKEN_KEY') || '')
  
  // interface JwtPayload {
  //   exp: number; // 过期时间戳
  //   // 你可以添加其他你需要的字段
  // }
  // // 用于解析 base64 编码的字符串
  // function base64Decode(base64: string): string {
  //   const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  //   const base64String = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/');
  //   const data = window.atob(base64String);
  //   return data;
  // }
  // // 用于解析 JWT 令牌并获取 payload
  // function parseJwt(token: string): JwtPayload | null {
  //   const parts = token.split('.');
  //   if (parts.length !== 3) return null;

  //   const payload = base64Decode(parts[1]);
  //   try {
  //     return JSON.parse(payload) as JwtPayload;
  //   } catch (error) {
  //     return null;
  //   }
  // }
  // // 检查令牌是否过期
  // function isTokenExpired(token: string): boolean {
  //   const payload = parseJwt(token);
  //   if (!payload || !payload.exp) return true;
  //   const now = Math.floor(Date.now() / 1000);
  //   return now > payload.exp
  // }
  // // 使用示例
  // const isExpired = isTokenExpired(token.value);
  // if (isExpired) {
  //   token.value = ''
  //   localStorage.removeItem('TOKEN_KEY')
  // }

  // 权限变量 0——管理员 1——审核员 2——用户 
  const permissions = ref<number>(Number(localStorage.getItem('PERMISSIONS') || 2))

  function setToken(value: string) {
    token.value = value
    localStorage.setItem('TOKEN_KEY', value)
  }
  function removeToken() {
    token.value = ''
    localStorage.removeItem('TOKEN_KEY')
  }
  function setPermissions(value: number) {
    permissions.value = value
    localStorage.setItem('PERMISSIONS', value.toString())
  }
  return { token, permissions, setToken, removeToken, setPermissions }
})
