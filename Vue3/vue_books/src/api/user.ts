//接口定义
import requeset from '@/utils/request'
//获取泛型类型
import type { ResType } from "./results";
//注册接口
//提交后端数据类型
type RegisteredData = {
    username:string,
    password:string
}
const a:number = 10

export const userRegisterAPI = (data:RegisteredData) => requeset.post<ResType<string>>('/api/reguser',data) 