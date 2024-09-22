// 路由处理模块
//导入数据库模块
const db = require('../db/index')
// 导入 fs 模块
const fs = require('fs');
// 将word转化为html中间件
const mammoth = require('mammoth');
//导入同意错误返回信息
const { isNoRes } = require('../utils/resNo')
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
//上传文件处理模块
exports.uploadFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).send('未上传文件！')
  }
  const file = req.file; // 前端发送的文件字段名为 "file"
  const uniqueFileName = `${uuidv4()}${path.extname(file.originalname)}`
  // 上传文件
  uploader.uploadFile(file.path, uniqueFileName)
    .then(result => {
      // 构建文件的外链
      const cdnPrefix = uploader.URL;
      const fileUrl = `${cdnPrefix}/${uniqueFileName}`
      res.result('上传成功！', 0, { url: fileUrl })
    })
    .catch(error => {
      console.error('Failed to upload file:', error)
      res.status(500).json({ success: false, message: 'Failed to upload file.', error: error.message })
    })
    .then(() => {
      fs.unlink(file.path, err => {
        if (err) {
          console.error('Error deleting temporary file:', err)
        }
      })
    })
}

// 根据文件名获取word文档转化为html返回
exports.getWordForHtml = async (req, res) => {
  try {
    const { fileName } = req.query; // 前端发送的文件名
    if (!fileName) {
      return res.status(400).send('File name is required.');
    }
    // 生成下载链接
    const bucketManager = new qiniu.rs.BucketManager(uploader.mac, uploader.config);
    const downloadUrl = bucketManager.publicDownloadUrl(uploader.URL, fileName);
    axios.get(downloadUrl, { responseType: 'arraybuffer' })
      .then(response => {
        // 检查响应是否成功
        if (!response || !response.data) {
          throw new Error('Failed to download the file.');
        }
        // 将ArrayBuffer转换为Buffer
        const buffer = Buffer.from(response.data);
        // 使用mammoth将ArrayBuffer转换为HTML
        mammoth.convertToHtml({ buffer: buffer })
          .then(result => {
            // 转换结果是一个对象，其中包含转换后的HTML
            res.result('获取成功', 0, result.value)
          })
          .catch(error => {
            res.result(error)
          });
      })
      .catch(error => {
        res.result(error)
      });

  } catch (error) {
    res.status(500).result(error)
  }
}