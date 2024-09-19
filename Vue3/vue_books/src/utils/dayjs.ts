import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn'; // 引入中文语言包

// 格式化时间函数
export const formDate = (time: string) => {
  const formTime = dayjs(new Date(time)).format('YYYY年MM月DD日');
  return formTime
}