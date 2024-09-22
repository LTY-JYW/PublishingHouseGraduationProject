const qiniu = require('qiniu');

// 七牛云 Access Key 和 Secret Key
const ACCESS_KEY = 'xSLGlmIAZWi-YwnII7RsZItiOFFGJ7YrLbvJVbn2'
const SECRET_KEY = 'qGUrALu5eUUims0QBVr6Dl3sVpMKyw4-Ejh2V1EX'
// 存储空间名称
const BUCKET_NAME = 'graduation-project-publishing-house'
// 七牛云自定义域名
// const URL = 'http://qiniuy.ltyjyw.site'
/**
 * 创建一个七牛云文件上传器类
 */
class QiNiuUploader {
  /**
   * 构造函数
   */
  constructor() {
    this.BUCKET_NAME = 'graduation-project-publishing-house'
    this.URL = 'http://qiniuy.ltyjyw.site'
    // 初始化配置
    this.config = new qiniu.conf.Config();
    // 设置使用http域名
    this.config.useHttpsDomain = false;
    // 设置使用自定义域名
    this.config.useCdnDomains = true;
    // 设置自定义域名
    this.config.cdnPrefix = URL;

    // 创建鉴权对象
    this.mac = new qiniu.auth.digest.Mac(ACCESS_KEY, SECRET_KEY);

    // 创建上传策略对象
    this.putPolicy = new qiniu.rs.PutPolicy({
      scope: BUCKET_NAME,
      // 可以在这里添加其他策略选项
    });

    // 创建表单上传对象，并设置超时时间为 60 秒
    this.formUploader = new qiniu.form_up.FormUploader(this.config, { timeout: 120000 })
    // 创建配置对象
    this.extra = new qiniu.form_up.PutExtra(); // 手动创建一个空对象作为 Extra 的替代
  }

  /**
   * 获取上传凭证
   * @returns {Promise<string>} 上传凭证
   */
  async getUploadToken() {
    return this.putPolicy.uploadToken(this.mac);
  }

  /**
   * 上传文件
   * @param {string} filePath - 文件路径
   * @param {string} key - 文件名
   * @returns {Promise<object>} 上传结果
   */
  async uploadFile(filePath, key) {
    try {
      // 获取上传凭证
      const token = await this.getUploadToken();

      const options = {
        // 设置超时时间
        timeout: this.config.timeout,
        // 设置重试策略
        retryCount: 3,
        // 自定义重试逻辑
        onBeforeRetry: (context) => {
          if (context.result && typeof context.result.needRetry === 'function' && context.result.needRetry()) {
            console.log('Retrying upload...');
            return true;
          }
          console.log('Upload failed. No retry needed.');
          return false;
        },
      };

      // 执行上传操作
      return new Promise((resolve, reject) => {
        this.formUploader.putFile(token, key, filePath, this.extra, (err, respBody, respInfo) => {
          if (!err && respInfo.statusCode === 200) {
            resolve(respBody);
          } else {
            reject(new Error(`Failed to upload the file. ${err || JSON.stringify(respInfo)}`));
          }
        }, options);
      });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = QiNiuUploader;