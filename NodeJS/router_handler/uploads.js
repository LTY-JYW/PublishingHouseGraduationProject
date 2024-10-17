// 路由处理模块
//导入数据库模块
const db = require('../db/index')
// 导入 fs 模块
const fs = require('fs');
// 将word转化为html中间件
const mammoth = require('mammoth');
// 导入七牛云工具
const QiNiuUploader = require('../utils/qiNiu');
// 导入uuid创建唯一的文件名
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
// 导入path 获取路径
const path = require('path');
// 创建上传器实例
const uploader = new QiNiuUploader();
const qiniu = require('qiniu');
// 文件压缩类
const compressImage = require('../utils/sharp.js');
const AlibabaCloud = require('../utils/alibabaCloud.js')
const alibabaCloud = new AlibabaCloud()

//上传图片文件处理模块
exports.uploadImgFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).send('未上传文件！')
  }
  // 前端发送的文件字段名为 "file"
  const file = req.file
  // 前端标识符
  const flag = req.body.flag
  if (!file.mimetype.startsWith('image/')) {
    return res.status(400).send('请上传图片文件！');
  }
  let uniqueFileName = ''
  if(flag == 'avatar'){
    uniqueFileName = `${process.env.OSS_AVATAR}${new Date().getTime()}${uuidv4()}.webp`
  }else if(flag == 'category'){
    uniqueFileName = `${process.env.OSS_CATEGORY}${new Date().getTime()}${uuidv4()}.webp`
  }else if(flag == 'information'){
    uniqueFileName = `${process.env.OSS_INFORMATION}${new Date().getTime()}${uuidv4()}.webp`
  }
  // 使用sharp压缩图片
  const compressedFilePath = await compressImage(file.buffer);
  const a = alibabaCloud.upPut(uniqueFileName, compressedFilePath)
  a.then((resData) => {
    return res.result('上传成功', 0, { url: resData.url })
  }).catch((err) => {
    return res.result(err)
  })
}

//上传word文件处理模块
exports.uploadWordFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).send('未上传文件！')
  }
  // 前端发送的文件字段名为 "file"
  const file = req.file;
  const uniqueFileName = `${process.env.OSS_WORD}${uuidv4()}${path.extname(file.originalname)}`
  const a = alibabaCloud.upPut(uniqueFileName, file.buffer)
  a.then((resData) => {
    return res.result('上传成功', 0, { url: resData.name })
  }).catch((err) => {
    return res.result(err)
  })
}



// 根据文件名获取word文档转化为html返回
exports.getWordForHtml = async (req, res) => {
  const { fileName } = req.query
  try {
    // 从OSS获取Word文档
    const result = await alibabaCloud.getBuffer(fileName)
    const buffer = result.content;
    // 使用mammoth将Word文档转换为HTML
    const htmlResult = await mammoth.convertToHtml({ buffer });
    // 发送转换后的HTML回前端
    res.result('获取html成功',0,{html:htmlResult.value})
  } catch (error) {
    // 处理错误情况
    console.error('Error:', error);
    res.status(500).send('Error converting document');
  }
}