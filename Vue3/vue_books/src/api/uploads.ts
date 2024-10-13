//接口定义
import requeset from '@/utils/request'
//导入泛型类型
import type { ResType } from "./results";

export type HtmlType = {
    html:string
}
// 获取七牛云word内容
export const getHtmlAPI = (fileName:string) => requeset.get<ResType<HtmlType>>('/api/gethtml',{params:{fileName}})

// 上传文件返回类型
export type uploadFileResType = {
    url:string
}
export const uploadsFileAPI = (data:FormData) => requeset.post<ResType<uploadFileResType>>('/api/upload/img',data)

// 上传word文件
export const uploadsFileWordAPI = (data:FormData) => requeset.post<ResType<uploadFileResType>>('/api/upload/word',data)
