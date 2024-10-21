import { MessageMedia } from 'whatsapp-web.js';
import path from 'path';
import fs from 'fs/promises';
import uploadFileToS3 from '../AWS/S3/uploadS3';
import { deleteFile } from '../../utils/deleteFile';

const handleMediaMessage = async (media: MessageMedia, bucketName: string) => {
    const buffer = Buffer.from(media.data, 'base64');
    const fileType = media.mimetype.split('/');
    const fileExtension = fileType[1];
    const newFileName = `${Date.now()}.${fileExtension}`;
    const filePath = path.join(__dirname, '../../../uploads', newFileName);

    await fs.writeFile(filePath, buffer);
    const s3Url = await uploadFileToS3(bucketName, filePath);

    try {
        await deleteFile(filePath);
    } catch (error) {
        console.error('Error al eliminar el archivo local:', error);
    }

    return s3Url;
};

export default handleMediaMessage;