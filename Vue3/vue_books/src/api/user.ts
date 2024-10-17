//接口定义
import requeset from '@/utils/request'
//获取泛型类型
import type { ResType, PageType, ResListTpye } from "./results";
//注册接口
//提交后端数据类型
interface RegisteredData {
    username: string
    password: string
}
// 用户注册API
export const userRegisterAPI = (data: RegisteredData) => requeset.post<ResType<string>>('/api/reguser', data)

// 登录返回类型
export type UserLoginType = {
    token: string
}
// 用户登录API
export const userLoginAPI = (data: RegisteredData) => requeset.post<ResType<UserLoginType>>('/api/login', data)

// 获取用户列表提交类型
export type UserListType = {
    id: number
    username: string
    nickname: string
    avatar: string
    email: string
    briefly: string
    disable: number
    isAuthor: number
    aid: string
    heat: number
    flyer: string
    aValue: null
    time:string
}[]

// 获取用户列表API
export const userGetListAPI = (params: PageType) => requeset.get<ResType<ResListTpye<UserListType>>>('/my/overy', { params })
// 获取用户列表API无鉴权
export const userGetListNoPageAPI = () => requeset.get<ResType<ResListTpye<UserListType>>>('/api/')

// 用户详细信息返回类型
export type UserInfoType = {
    id: number
    username: string
    nickname: string
    avatar: string
    email: string
    brieflt:string
    disable: number
    isAuthor: number
    aid:number
    aValue:string
}[]
// 获取用户详细信息API
export const userGetInfoAPI = () => requeset.get<ResType<UserInfoType>>('/my/userinfo')
// 管理员获取用户详细信息API
export const userGetInfoAdminAPI = () => requeset.get<ResType<UserInfoType>>('/my/userinfoadmin')


// 申请成为作者API
export const userAuthorAPI = () => requeset.post<ResType<undefined>>('/my/author')

// 更新用户详细信息提交类型
export type UserUpInfoType = {
    id: number
    nickname: string
    email: string
    briefly:string
    avatar: string
}
// 更新用户信息API
export const userUpInfoAPI = (data:UserUpInfoType) => requeset.put<ResType<undefined>>('/my/userinfo',data)

// 用户更新密码提交数据类型
export type UserPWDType = {
    oldPwd:string
    newPwd:string
}
// 用户更新密码API
export const userUpPWDAPI = (data:UserPWDType) => requeset.put<ResType<undefined>>('/my/pwd',data)

// 用户跟新头像API
export const userUpAvatarAPI = (avatar:string) => requeset.put<ResType<undefined>>('/my/avatar',avatar)

// 提交id类型
export type IdType = {
    id:number
}
// 启用用户API
export const userEnableAPI = (data:IdType) => requeset.post<ResType<undefined>>('/my/admin/enable',data)
// 禁用用户API
export const userUpDissableAPI = (data:IdType) => requeset.post<ResType<undefined>>('/my/admin/disable',data)

