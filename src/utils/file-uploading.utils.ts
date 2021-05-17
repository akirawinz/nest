import { extname } from 'path';
import { diskStorage } from 'multer';

export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new Error('Only image files are allowed!'), false);
  }
  callback(null, true);
};

export const editFileName = (req, file, callback) => {
  console.log(file, 'file');
  const name = file.originalname.split('.')[0] || file.name.split('.')[0];
  const fileExtName = extname(file.originalname || file.name);
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
      filename: editFileName,
    }),
    fileFilter: imageFileFilter,
  };
};
