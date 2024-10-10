//接口定义
import requeset from '@/utils/request'
//获取泛型类型
import type { ResType, PageType, ResListTpye } from "./results";

//查询一级分类列表 
// 查询一级分类列表返回类型
export type CategoryType = {
    id: number
    name:string
    profile:string
}[]
// 查询一级分类列表API
export const categoryGetListAPI = (params: PageType) => requeset.get<ResType<ResListTpye<CategoryType>>>('/my/category', { params })

// 查询一级分类详细信息提交类型
export type CategoryInfoType = {
    id: number
    name:string
    profile:string
    cid:number
    cover:string
}[]
// 查询一级分类详细信息
export const categoryInfoAPI = (id:number) => requeset.get<ResType<CategoryInfoType>>('/my/category/info', { params:{id} })

// 添加一级分类
// 添加一级分类提交数据类型
export type CategoryAddType = {
    name:string
    profile:string
}
// 添加一级分类API
export const categoryAddAPI = (data:CategoryAddType) => requeset.post<ResType<undefined>>('/my/category',data)

// 修改一级分类提交数据类型
export type CategoryUpdataType = {
    id:number
    name:string
    profile:string
}
// 修改一级分类API
export const categoryUpdataAPI = (data:CategoryUpdataType) => requeset.put<ResType<undefined>>('/my/category',data)

// 删除一级分类API
export const categoryDeleteAPI = (id:number) => requeset.delete<ResType<undefined>>('/my/category',{params:{id}})

// 查询一级分类名列表返回类型
export type CategoryNameType = {
    id:number
    name:string
}[]
// 获取一级分类名API
export const categoryNameAPI = () => requeset.get<ResType<CategoryNameType>>('/my/category/name')

