//接口定义
import requeset from '@/utils/request'
//获取泛型类型
import type { ResType,PageType } from "./results";
//注册接口
//提交后端数据类型
interface RegisteredData {
    username:string,
    password:string
}

// 登录返回类型
export type AuditLoginType = {
        token:string
}

// 获取审核员基本信息返回类型
export type AuditOveryType = [{
    id:number
    username:string
    nickname:string
    avatar:string
}]

// 审核员注册API
export const auditRegisterAPI = (data:RegisteredData) => requeset.post<ResType<string>>('/api/audit/reguser',data) 
// 审核员登录API
export const auditLoginAPI = (data:RegisteredData) => requeset.post<ResType<AuditLoginType>>('/api/audit/login',data) 
// 获取审核员基本信息API
export const auditGetOveryApi = (page:number,itemsPerPage:number) => requeset.get<ResType<AuditOveryType>>('/my/audit/overy',{params:{page,itemsPerPage}})