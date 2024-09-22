//接口定义
import requeset from '@/utils/request'
//获取泛型类型
import type { ResType, PageByType, ResListTpye } from "./results";

//查询资讯列表 
// 查询资讯列表返回类型
export type InformationType = {
    id: number,
    title:string,
    main: string,
    time:string,
    audit_id: number,
    author_id: number,
    count: number,
    disable: number
}[]
// 查询资讯列表API
export const informationGetListAPI = (params: PageByType) => requeset.get<ResType<ResListTpye<InformationType>>>('/my/news', { params })

// 添加资讯
// 添加资讯提交类型
export type InformationAddType = {
    title:string
    main:string
}
// 添加资讯API
export const informationAddAPI = (data:InformationAddType) => requeset.post<ResType<undefined>>('/my/news', data)

// 删除资讯
// 删除资讯API
export const informationDeleteAPI = (id:number) => requeset.delete<ResType<undefined>>('/my/news',{params:{id}})
