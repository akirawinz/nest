import { extname } from 'path';
import { diskStorage, DiskStorageOptions, Options } from 'multer';

const filterImageFile: Options['fileFilter'] = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new Error('Only image files are allowed!'));
  }
  callback(null, true);
};

const buildFileName: DiskStorageOptions['filename'] = (req, file, callback) => {
  const name = file.originalname.split('.')[0] || file.filename.split('.')[0];
  const fileExtName = extname(file.originalname || file.filename);
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${name}-${randomName}${fileExtName}`);
};

export const uploadImagePath = () => {
  return {
    storage: diskStorage({
      destination: './upload',
      filename: buildFileName,
    }),
    fileFilter: filterImageFile,
  };
};
