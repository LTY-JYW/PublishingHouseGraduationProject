//接口定义
import requeset from '@/utils/request'
//获取泛型类型
import type { ResType, PageType, ResListTpye } from "./results";
// 获取公共类型
import type { CategoryNameType } from '@/api/category'

//注册接口
// 发送验证码返回类型
export type EmailType = {
    verificationCode:string
}
// 发送验证码API
export const emailAPI = (recipient: string) => requeset.post<ResType<EmailType>>('/api/email', {  recipient  })