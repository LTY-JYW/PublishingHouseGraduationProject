//接口定义
import requeset from '@/utils/request'
//导入泛型类型
import type { ResType } from "./results";
// 导入公共类型
import type { UserInfoType,UserPWDType } from "./user";


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
export type AdminGetInfoType = {
    id:number
    username:string
    nickname:string
    avatar:string
}[]



// 管理员注册API
export const adminRegisterAPI = (data:RegisteredData) => requeset.post<ResType<string>>('/api/admin/login',data) 

// 管理员登录API
export const adminLoginAPI = (data:RegisteredData) => requeset.post<ResType<AdminLoginType>>('/api/admin/login',data) 

// 获取管理员基本信息API
export const adminGetInfoApi = () => requeset.get<ResType<AdminGetInfoType>>('/my/admin/getinfo')

// 管理员获取用户信息API
export const adminGetUserInfoAPI = ( id:number ) => requeset.get<ResType<UserInfoType>>('/my/userinfoadmin',{params:{id}})

// 管理员更新信息类型
type formDataType = {
  nickname: string
}
// 管理员更新信息API
export const adminUpInfoAPI = ( data:formDataType ) => requeset.put<ResType<undefined>>('/my/admin/info',data)

// 管理员更新密码API
export const adminUpPwdAPI = (data:UserPWDType) => requeset.put<ResType<undefined>>('/my/admin/pwd',data)

// 管理员更新头像API
export const adminUpAvatarAPI = (data:{avatar:string}) => requeset.put<ResType<undefined>>('/my/admin/avatar',data)
