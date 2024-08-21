// 导入 date-fns 的 format 函数
const { format } = require('date-fns');
/**
 * 将给定的日期格式化为 YYYY-MM-DD 格式
 * @param {Date} date - 需要格式化的日期对象
 * @returns {string} 格式化后的日期字符串
 */
exports.timeDate = (date) => {
    return format(date, 'yyyy-MM-dd');
}