import { extname } from 'path';
import { v4 as uuid } from 'uuid';

export const imageFileFilter = (_req, file: Express.Multer.File, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new Error('Only image files are allowed!'), false);
  }
  callback(null, true);
};

export const editFileName = (_req, file: Express.Multer.File, callback) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const autoGenratedName = uuid().replace(/-/g, '');
  callback(null, `${name}-${autoGenratedName}${fileExtName}`);
};
