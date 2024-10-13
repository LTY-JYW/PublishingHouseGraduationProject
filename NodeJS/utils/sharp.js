const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

/**
 * 压缩图片并返回文件Buffer
 * @param {Buffer} fileBuffer - 图片文件的Buffer
 * @returns {Promise<Buffer>} 压缩后的图片文件Buffer
 */
async function compressImage(fileBuffer) {
  // const outputFilePath = path.join(path.dirname(filePath), `compressed_${path.basename(filePath)}`);
  // await sharp(filePath)
  //   .resize(800)
  //   .toFormat('webp')
  //   .toFile(outputFilePath)
  // return outputFilePath;
  const compressedBuffer = await sharp(fileBuffer)
    .resize(800)
    .toFormat('webp')
    .toBuffer();

  return compressedBuffer;
}

module.exports = compressImage;