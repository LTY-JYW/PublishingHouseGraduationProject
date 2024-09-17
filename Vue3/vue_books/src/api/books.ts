//接口定义
import requeset from '@/utils/request'
//获取泛型类型
import type { ResType, PageType } from "./results";

//注册接口
//提交后端数据类型
export interface BooksGetListType {
    page: number
    itemsPerPage: number
    by: string
    des: string
}
// 获取图书列表每一项的返回类型
export type BooksResListType = {
    id: number,
    cid: number,
    uid: number,
    aid: number,
    name: string,
    profile: string,
    time: string,
    edition: number,
    price: number,
    pages: number,
    number: number,
    topic: string,
    popularity: number,
    cover: string,
    disable: number,
    isdelete: number
}[]
// 获取图书列表返回类型
export type BooksOveryType = {
    value: BooksResListType
    count: number
}
// 获取未删除图书列表
export const booksGetListAPI = (params: BooksGetListType) => requeset.get<ResType<BooksOveryType>>('/my/books/overy', { params })
// 获取所有图书列表
export const booksGetListOveryAPI = (params: BooksGetListType) => requeset.get<ResType<BooksOveryType>>('/my/books/overyevery', { params })

// 修改图书信息类型
export type BooksInfoType = {
    // id
    id: number,
    // 分类
    cid: string,
    // 名称
    name: string,
    // 简介
    profile: string,
    // 版次
    edition: number,
    // 价格
    price: number,
    // 页数
    pages: number,
    // 卷数
    number: number,
    // 主题词
    topic: string,
    // 封面
    cover: string,
}
// 更新图书信息
export const booksUpInfoAPI = (data:BooksInfoType) => requeset.post<ResType<undefined>>('/my/books/update',data)

// 删除图书
export const booksDelAPI = (id:number) => requeset.delete<ResType<undefined>>('/my/books/delete',{params:{id}})

// 恢复图书
export const booksRestoreAPI = (id:number) => requeset.post<ResType<undefined>>('/my/books/restore',{id})
