import type { ResType } from '@/api/results'
// 导入el组件
import { ElMessage } from 'element-plus'
// 统一错误提示
export const isOk = (data:ResType<any>) => {
    if(data.code !== 0){
        ElMessage.error(data.message)
    }
}

// 返回最后一页
export const lastPage = (total:number,itemsPerPage:number) => {
    if(total+1%itemsPerPage === 0){
        return Math.floor(total/itemsPerPage)
    }else{
        return Math.floor(total/itemsPerPage)+1
    }
}
