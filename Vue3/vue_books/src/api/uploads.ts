//接口定义
import requeset from '@/utils/request'
//导入泛型类型
import type { ResType } from "./results";

// 获取七牛云word内容
export const getHtmlAPI = (fileName:string) => requeset.get<ResType<string>>('/api/gethtml',{params:{fileName}}) 
// 七牛云上传文件
// 上传文件返回类型
export type uploadFileResType = {
    url:string
}
export const uploadsFileAPI = (data:FormData) => requeset.post<ResType<uploadFileResType>>('/api/upload',data)
export const uploadFileUrl = 'http://127.0.0.1/api/upload'