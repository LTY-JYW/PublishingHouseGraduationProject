//泛用类型定义
export type ResType <Type> = {
    code:number
    message: string
    data: Type
}