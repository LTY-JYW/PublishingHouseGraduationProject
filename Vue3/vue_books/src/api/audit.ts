//接口定义
import requeset from '@/utils/request'
//获取泛型类型
import type { ResType, ResListTpye } from "./results";
import type { UserPWDType  } from '@/api/user'
//注册接口
//提交后端数据类型
export interface AuditRegisteredType {
    username: string,
    password: string
}

// 登录返回类型
export type AuditLoginType = {
    token: string
}

// 获取审核员基本信息返回类型
export type AuditInfoType = {
    id: number
    username: string
    nickname: string
    avatar: string
}[]


// 审核员注册API
export const auditRegisterAPI = (data: AuditRegisteredType) => requeset.post<ResType<undefined>>('/api/audit/reguser', data)

// 审核员登录API
export const auditLoginAPI = (data: AuditRegisteredType) => requeset.post<ResType<AuditLoginType>>('/api/audit/login', data)

// 获取审核员列表API
export const auditGetOveryApi = (page: number, itemsPerPage: number) => requeset.get<ResType<ResListTpye<AuditInfoType[]>>>('/my/audit/overy', { params: { page, itemsPerPage } })

// 管理员获取审核员详细信息API
export const auditAdminGetInfo = (id: string) => requeset.get<ResType<AuditInfoType>>('/my/audit/getInfoadmin', { params: { id } })

// 获取审核员详细信息API
export const auditGetInfo = () => requeset.get<ResType<AuditInfoType>>('/my/audit/getInfo')

// 驳回成为作者API
export const auditIsNoAuthorAPI = (id: number) => requeset.post<ResType<undefined>>('/my/audit/isNoAuthor', {id})
// 同意成为作者API    
export const auditIsOkAuthorAPI = (id: number) => requeset.post<ResType<undefined>>('/my/audit/isOkAuthor', {id})

// 通过资讯审核API
export const auditIsOkInformationAPI = (id: number) => requeset.post<ResType<undefined>>('/my/audit/isOkinformation', {id})
// 驳回资讯审核API
export const auditIsNoInformationAPI = (id: number) => requeset.post<ResType<undefined>>('/my/audit/isNoinformation', {id})

// 同意图书审核API    
export const auditIsOkBookAPI = (id: number) => requeset.post<ResType<undefined>>('/my/audit/isOkBook',{id})
// 驳回图书审核API    
export const auditIsNoBookAPI = (id: number) => requeset.post<ResType<undefined>>('/my/audit/isNoBook', {id})

// 更新审核员详细信息API
export const auditUpInfoAPI = (data:{nickname:string}) => requeset.put<ResType<undefined>>('/my/audit/info',data)

// 更新审核员密码API
export const auditUpPwdAPI = (data: UserPWDType) => requeset.put<ResType<undefined>>('/my/audit/pwd', data)

// 更新审核员头像API
export const auditUpAvatarAPI = (avatar: string) => requeset.put<ResType<undefined>>('/my/audit/avatar', {avatar})