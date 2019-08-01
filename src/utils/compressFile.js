import Compressor from 'compressorjs';

export default function compressFile(file) {
  return new Promise((resolve, reject) => {
    new Compressor(file, {
      quality: 0.4,
      success(result) {
        resolve(result);
      },
      error(err) {
        console.log(err.message);
        reject(err);
      },
    });
  });
}
