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
export type UserLoginType = {
        token:string
}

// 用户详细信息返回类型
export type UserInfoType = [
    {
        id: number,
        username: string,
        nickname: string,
        email: string,
        avatar: string,
        disable: number,
        isAuthor: number
    }
]

// 用户注册API
export const userRegisterAPI = (data:RegisteredData) => requeset.post<ResType<string>>('/api/reguser',data) 
// 用户登录API
export const userLoginAPI = (data:RegisteredData) => requeset.post<ResType<UserLoginType>>('/api/login',data) 

// 