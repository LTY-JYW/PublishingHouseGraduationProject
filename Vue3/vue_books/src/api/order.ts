//接口定义
import requeset from '@/utils/request'
//获取泛型类型
import type { ResType, PageType, ResListTpye } from "./results";

// 添加订单API
export const orderAddAPI = (id: number) => requeset.post<ResType<undefined>>('/my/order', id)

// 删除订单API
export const orderDelAPI = (id: number) => requeset.delete<ResType<undefined>>('/my/order', { params: { id } })

// 发布订单API
export const orderUpAPI = (id: number) => requeset.put<ResType<undefined>>('/my/order', { params: { id } })

// 查询订单返回类型
export type OrderSelType = {
    id: number
    uid: number
    bid: number
    count:number
    shipping: number
    time: string
    nickname: string
    bookName: string
    cover: string
    price:number
    phoneNumber:number
}[]
// 查询订单API
export const orderSelAPI = (params: PageType) => requeset.get<ResType<OrderSelType>>('/my/order', { params })

// 查询订单详细信息地址返回类型
export type OrderAddressType = {
    id: number
    uid: number
    address: string
    default: number
}[]
// 查询订单详细信息订单内容返回类型
export type OrderDataInfoType = {
    id: number
    uid: number
    bid: number
    shipping: number
    time: string
    count: number
    nickname: string
    phoneNumber: null
    bookName: string
    cover: string
    price: number
}
// 查询订单详细信息返回类型
export type OrderInfoType = {
    order:OrderDataInfoType,
    address:OrderAddressType
}
// 查询订单详细信息API
export const orderInfoAPI = (id:number) => requeset.get<ResType<OrderInfoType>>('/my/order/info', { params:{id} })
