//接口定义
import requeset from '@/utils/request'
//获取泛型类型
import type { ResType } from "./results";
//注册接口
//提交后端数据类型
type RegisteredData = {
    username:string,
    password:string
}

// 登录返回类型
export type UserLoginType = {
        token:string
}
// 用户注册API
export const userRegisterAPI = (data:RegisteredData) => requeset.post<ResType<string>>('/api/reguser',data) 
// 用户登录API
export const userLoginAPI = (data:RegisteredData) => requeset.post<ResType<string>>('/api/login',data) 