// 路由处理模块
//导入数据库模块
const db = require('../db/index')
// 导入 fs 模块
const fs = require('fs');
//导入同意错误返回信息
const { isNoRes } = require('../utils/resNo')
// 导入七牛云工具
const QiNiuUploader = require('../utils/qiNiu');
// 导入uuid创建唯一的文件名
const {  v4: uuidv4 } = require('uuid');
// 导入path 获取路径
const path = require('path');
// 创建上传器实例
const uploader = new QiNiuUploader();
//上传文件处理模块
exports.uploadFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No files were uploaded.');
  }
  const file = req.file; // 假设前端发送的文件字段名为 "file"
  const uniqueFileName = `${uuidv4()}${path.extname(file.originalname)}`;
  // 上传文件
  uploader.uploadFile(file.path, uniqueFileName)
    .then(result => {
      console.log('File uploaded successfully:', result);
       // 构建文件的外链
       const cdnPrefix = uploader.config.cdnPrefix;
       const fileUrl = `${cdnPrefix}/${uniqueFileName}`;
       console.log(fileUrl);
    res.result('File uploaded successfully.',0,{url:fileUrl})
    })
    .catch(error => {
      console.error('Failed to upload file:', error);
      res.status(500).json({ success: false, message: 'Failed to upload file.', error: error.message });
    })
    .then(() => {
      fs.unlink(file.path, err => {
        if (err) {
          console.error('Error deleting temporary file:', err);
        }
      });
    });
};