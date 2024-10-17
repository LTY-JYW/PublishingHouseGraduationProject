const OSS = require('ali-oss')
class AlibabaCloud {
    constructor() {
        // 初始化OSS客户端。请将以下参数替换为您自己的配置信息。
        this.client = new OSS({
            // 示例：'oss-cn-hangzhou'，填写Bucket所在地域。
            // 确保已设置环境变量OSS_ACCESS_KEY_ID。
            accessKeyId: process.env.OSS_ACCESS_KEY_ID,
            // 确保已设置环境变量OSS_ACCESS_KEY_SECRET。
            accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
            // 示例：'my-bucket-name'，填写存储空间名称。
            bucket: 'tianyi-books',
            // 添加region配置
            region: 'cn-beijing',
            // 使用自定义域名作为Endpoint。
            endpoint: process.env.URL,
            cname: true
        })
    }

    // 本地上传
    async upPut(toPath, file) {
        // 自定义请求头
        // const headers = {
        //     // 指定Object的存储类型。
        //     'x-oss-storage-class': 'Standard',
        //     // 指定Object的访问权限。
        //     'x-oss-object-acl': 'private',
        //     // 通过文件URL访问文件时，指定以附件形式下载文件，下载后的文件名称定义为example.txt。
        //     'Content-Disposition': 'attachment; filename="example.txt"',
        //     // 设置Object的标签，可同时设置多个标签。
        //     'x-oss-tagging': 'Tag1=1&Tag2=2',
        //     // 指定PutObject操作时是否覆盖同名目标Object。此处设置为true，表示禁止覆盖同名Object。
        //     'x-oss-forbid-overwrite': 'true',
        // }
        try {
            // 填写OSS文件完整路径和本地文件的完整路径。OSS文件完整路径中不能包含Bucket名称。
            // 如果本地文件的完整路径中未指定本地路径，则默认从示例程序所属项目对应本地路径中上传文件。
            // 自定义headers
            const result = await this.client.put(toPath, file);
            return result
        } catch (e) {
            return e
        }
    }

    async getBuffer (filePath) {
        try {
            // console.log(filePath);
          const result = await this.client.get(filePath);
          return result
        } catch (e) {
          return e
        }
      }
}

module.exports = AlibabaCloud;
