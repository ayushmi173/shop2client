import { Injectable, NotFoundException } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class UploadService {
  async uploadImage(file: Express.Multer.File) {
    if (!file) throw new NotFoundException('file not found');

    return {
      originalName: file.originalname,
      fileName: file.filename,
      url: `http://localhost:6001/${file.path}`,
    };
  }

  async getUploadImage(path: string, res: Response) {
    return res.sendFile(path, { root: 'uploads' });
  }

  async uploadMultipleFiles(files: Express.Multer.File[]) {
    if (!files) throw new NotFoundException('files not found');

    const response: any = [];
    files.forEach((file) => {
      const fileReponse = {
        originalname: file.originalname,
        filename: file.filename,
        url: `http://localhost:6001/${file.path}`,
      };
      response.push(fileReponse);
    });
    return response;
  }
}
