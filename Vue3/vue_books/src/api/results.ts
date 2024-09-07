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