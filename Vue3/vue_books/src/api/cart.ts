//接口定义
import requeset from '@/utils/request'
//获取泛型类型
import type { ResType, PageType, ResListTpye } from "./results";

// 添加购物车API
export const cartAddAPI = (bid: number) => requeset.post<ResType<undefined>>('/my/cart', {bid})

// 删除购物车API
export const cartDelAPI = (id: number) => requeset.delete<ResType<undefined>>('/my/cart',{data:{id}})

// 更新购物车数量提交类型
export type UpNumType = {
    id:number
    count:number
}
// 更新购物车数量API
export const cartUpNumAPI = (data:UpNumType) => requeset.put<ResType<undefined>>('/my/cart',data)

// 查询购物车返回类型
export type CartListType = {
    id: number;
    uid: number;
    bid: number;
    price: number;
    count: number;
  }
// 查询购物车API
export const cartGetListAPI = (params:PageType) => requeset.get<ResType<ResListTpye<CartListType>>>('/my/cart',{params})