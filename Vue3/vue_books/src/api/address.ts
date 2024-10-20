//接口定义
import requeset from '@/utils/request'
//获取泛型类型
import type { ResType, PageType, ResListTpye } from "./results";

// 添加地址API
export const addressAddAPI = (address: string) => requeset.post<ResType<undefined>>('/my/address', {address})

// 删除地址API
export const addressDelAPI = (id: number) => requeset.delete<ResType<undefined>>('/my/address',{data:{id}})

// 更新地址数量提交类型
export type UpAddressType = {
    id:number
    address:string
}
// 更新地址数量API
export const addressUpAPI = (data:UpAddressType) => requeset.put<ResType<undefined>>('/my/address',data)

// 查询地址返回类型
export type AddressListType = {
    id: number
    uid: number
    address: string
    default: number
    uValue: string
    phoneNumber:string
  }[]
// 查询地址API
export const addressGetListAPI = (params:PageType) => requeset.get<ResType<ResListTpye<AddressListType>>>('/my/address',{params})

// 设置默认地址API
export const addressPuDefAPI = (id:number) => requeset.put<ResType<ResListTpye<AddressListType>>>('/my/address/def',{id})
