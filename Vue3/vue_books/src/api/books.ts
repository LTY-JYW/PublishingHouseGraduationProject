//接口定义
import requeset from '@/utils/request'
//获取泛型类型
import type { ResType, ResListTpye,PageByType,ByType } from "./results";

//注册接口
//提交后端数据类型
export interface BooksGetListType {
    page: number
    itemsPerPage: number
}
// 获取图书列表每一项的返回类型
export type BooksResListType = {
    id: number
    cid: number
    uid: number
    aid: number
    name: string
    profile: string
    time: string
    edition: number
    price: number
    pages: number
    number: number
    topic: string
    popularity: number
    cover: string
    disable: number
    isdelete: number
    cValue: string
    uValue: string
    aValue: string
    cProfile:string

}[]
// 获取未删除图书列表
export const booksGetListAPI = (params: PageByType) => requeset.get<ResType<ResListTpye<BooksResListType>>>('/api/books/overy', { params })
// 获取未删除图书列表（不分页）
export const booksGetListNoPageAPI = (params: ByType) => requeset.get<ResType<ResListTpye<BooksResListType>>>('/api/books/overyNo', { params })
// 获取所有图书列表
export const booksGetListOveryAPI = (params: BooksGetListType) => requeset.get<ResType<ResListTpye<BooksResListType>>>('/my/books/overyevery', { params })

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
export const booksUpInfoAPI = (data:BooksInfoType) => requeset.put<ResType<undefined>>('/my/books',data)

// 删除图书
export const booksDelAPI = (id:number) => requeset.delete<ResType<undefined>>('/my/books',{params:{id}})

// 恢复图书
export const booksRestoreAPI = (id:number) => requeset.post<ResType<undefined>>('/my/books/restore',{id})

// 图书详细信息返回类型
export type BookInfoType = {
    id: number
    cid: number
    uid: number
    aid: number
    name: string
    profile: string
    time: string
    edition: number
    price: number
    pages: number
    number: number
    topic: string
    popularity: number
    cover: string
    preview:string
    disable: number
    isdelete: number
    cValue:string
    uValue:string
    aValue:string
    uBriefly:string

}[]
// 获取图书详细信息
export const booksGetInfoAPI = (id:number) => requeset.get<ResType<BookInfoType>>('/api/books/info',{params:{id}})

// 获取作者图书列表返回类型
// export type BooksUserType = {
//   id: number;
//   cid: number;
//   uid: number;
//   aid: number;
//   name: string;
//   profile: string;
//   time: string;
//   edition: number;
//   price: number;
//   pages: number;
//   number: number;
//   topic: string;
//   popularity: number;
//   cover: string;
//   preview: string;
//   disable: number;
//   isdelete: number;
// }[]

export type BooksUserType = {
  id: number;
  name: string;
  profile: string;
  time: string;
  edition: number;
  price: number;
  pages: number;
  number: number;
  topic: string;
  popularity: number;
  cover: string;
  disable: number;
  isdelete: number;
  cValue: string;
  uValue: string;
  aValue: string;
}[]

export const booksGetUserBooksAPI = (id:number) => requeset.get<ResType<ResListTpye<BooksUserType>>>('/api/books/users',{params:{id}})

// 获取分类图书提交类型
export type BooksCategoryType = {
    page:number
    itemsPerPage:number
    cid:number
}
export const booksCategoryAPI = (params:BooksCategoryType) => requeset.get<ResType<ResListTpye<BooksResListType>>>('/api/books/categorybook',{params})