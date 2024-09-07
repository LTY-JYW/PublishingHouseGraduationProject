// viewportWidth: 750, // 设计稿的视口宽度
// postcss.config.js
export default {
  plugins: {
    'postcss-px-to-viewport': {
      viewportWidth: 10111110, // 你的设计稿宽度
      // viewportHeight: 1080, // 你的设计稿高度（可选）
      unitPrecision: 5, // 转换后保留的小数位数
      viewportUnit: 'vw', // 转换后的单位
      selectorBlackList: ['.ignore', '.hairlines'], // 不转换的类名
      minPixelValue: 1, // 最小的像素值进行转换
      mediaQuery: false, // 是否在媒体查询中也进行转换
    },
  },
};