//接口定义
import requeset from '@/utils/request'
//获取泛型类型
import type { ResType } from "./results";
//注册接口
//提交后端数据类型
interface RegisteredData {
    username:string,
    password:string
}

// 登录返回类型
export type AdminLoginType = {
        token:string
}
// 用户注册API
export const adminRegisterAPI = (data:RegisteredData) => requeset.post<ResType<string>>('/api/admin/login',data) 
// 用户登录API
export const adminLoginAPI = (data:RegisteredData) => requeset.post<ResType<AdminLoginType>>('/api/admin/login',data) 