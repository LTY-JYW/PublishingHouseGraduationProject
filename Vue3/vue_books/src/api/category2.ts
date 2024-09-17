//接口定义
import requeset from '@/utils/request'
//获取泛型类型
import type { ResType } from "./results";

//注册接口
// 获取分类详情的返回类型
export type CategoryInfoType = [{
    id: number,
    name: string,
    profile: string,
    cid: number
}]

// 获取分类详情
export const categoryInfoAPI = (id:number) => requeset.get<ResType<CategoryInfoType>>('/my/category2/info',{params:{id}}) 
