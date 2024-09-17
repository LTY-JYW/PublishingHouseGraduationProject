//接口定义
import requeset from '@/utils/request'
//获取泛型类型
import type { ResType } from "./results";
//注册接口
//提交后端数据类型
export interface AuditRegisteredType {
    username:string,
    password:string
}

// 登录返回类型
export type AuditLoginType = {
        token:string
}

// 获取审核员基本信息返回类型

export type AuditOveryValueType = [{
    id:number
    username:string
    nickname:string
    avatar:string
}]

export type AuditOveryType = {
    value:AuditOveryValueType
    count:number
}


// 审核员注册API
export const auditRegisterAPI = (data:AuditRegisteredType) => requeset.post<ResType<undefined>>('/api/audit/reguser',data) 
// 审核员登录API
export const auditLoginAPI = (data:AuditRegisteredType) => requeset.post<ResType<AuditLoginType>>('/api/audit/login',data) 
// 获取审核员列表API
export const auditGetOveryApi = (page:number,itemsPerPage:number) => requeset.get<ResType<AuditOveryType>>('/my/audit/overy',{params:{page,itemsPerPage}})
// 管理员获取审核员详细信息API
export const auditAdminGetInfo = (id:number) => requeset.get<ResType<AuditOveryValueType>>('/my/audit/getInfoadmin',{params:{id}})
// 获取审核员详细信息API
export const auditGetInfo = () => requeset.get<ResType<AuditOveryValueType>>('/my/audit/getInfo')