import multer from 'multer';
import path from 'path';
import { Request } from 'express';

const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    cb(null, path.join(__dirname, '../../temp'));
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    const { numeroWhatsapp } = req.params;
    cb(null, `${numeroWhatsapp}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
    return cb(new Error('Solo se permiten imágenes (JPEG, PNG, GIF, WEBP) y documentos (PDF, Word, Excel)'));
  }
};

export const upload = multer({ storage: storage, fileFilter: fileFilter });