import type { ResType } from '@/api/results'
// 导入el组件
import { ElMessage } from 'element-plus'
export const isOk = (data:ResType<any>) => {
    if(data.code !== 0){
        ElMessage.error(data.message)
    }
}