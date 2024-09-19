//泛用类型定义
export type ResType <Type> = {
    code:number
    message: string
    data: Type
}


// 查询数据页码类型
export type PageType = {
    page:number
    itemsPerPage:number
}


// 查询数据页面排序类型
export interface PageByType {
    page: number
    itemsPerPage: number
    by: string
    des: string
}

// 列表查询返回泛型
export type ResListTpye<Type> = {
    value: Type
    count: number
}