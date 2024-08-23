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

// 获取管理员基本信息返回类型
export type AdminGetInfoType = [{
    id:number
    username:string
    nickname:string
    avatar:string
}]

// 管理员注册API
export const adminRegisterAPI = (data:RegisteredData) => requeset.post<ResType<string>>('/api/admin/login',data) 
// 管理员登录API
export const adminLoginAPI = (data:RegisteredData) => requeset.post<ResType<AdminLoginType>>('/api/admin/login',data) 
// 获取管理员基本信息API
export const adminGetInfoApi = () => requeset.get<ResType<AdminGetInfoType>>('/my/admin/getinfo')