//接口定义
import requeset from '@/utils/request'
//获取泛型类型
import type { ResType, PageType, ResListTpye } from "./results";
// 获取公共类型
import type { CategoryNameType } from '@/api/category'

//注册接口
// 获取分类详情的返回类型
export type CategoryInfoType = [{
    id: number,
    name: string,
    profile: string,
    cid: number
}]
// 获取二级分类详情API
export const category2InfoAPI = (id: number) => requeset.get<ResType<CategoryInfoType>>('/my/category2/info', { params: { id } })

// 获取二级分类列表返回类型
export type Category2ListType = {
    id: number,
    name: string,
    profile: string,
    cid: number
    cover: string
    cValue: string
}[]
// 获取二级分类列表API
export const category2ListAPI = (params: PageType) => requeset.get<ResType<ResListTpye<Category2ListType>>>('/api/category2/overy', { params })

// 获取二级分类名API
export const category2NameAPI = () => requeset.get<ResType<CategoryNameType>>('/api/category2/name')

// 更新二级分类提交类型
export type Category2UpdataType = {
    id: number,
    name: string,
    profile: string,
}
// 更新二级分类API
export const category2UpdataAPI = (data: Category2UpdataType) => requeset.put<ResType<undefined>>('/my/category2', data)

// 删除二级分类API
export const category2DeleteAPI = (id: number) => requeset.delete<ResType<undefined>>('/my/category2', { params: { id } })

// 添加二级分类提交类型
export type Category2AddType = {
    cid: string,
    name: string,
    profile: string,
    cover: string
}
// 添加二级分类API
export const category2AddAPI = (data: Category2AddType) => requeset.post<ResType<undefined>>('/my/category2', data)


// 返回类型
export type categoryListItemType = {
    value: number
    label: string
}[]
export type categoryListType = {
    value: number
    label: string
    children:categoryListItemType
}[]
// 获取一级分类和二级分类信息
export const categoryListAPI = () => requeset.get<ResType<categoryListType>>('/api/category2')




