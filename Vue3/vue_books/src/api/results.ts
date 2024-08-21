//泛用类型定义
export type ResType <Type> = {
    status:number
    message: string
    data: Type
}