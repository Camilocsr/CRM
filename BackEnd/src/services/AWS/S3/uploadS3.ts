import { S3Client, PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3";
import { readFile } from "fs/promises";
import { basename, join } from "path";
import { v4 as uuidv4 } from "uuid";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import isNotImageFile from "../../../utils/isNotAudioFile";

async function removeOpusCodec(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const outputFilePath = join(__dirname, '../../uploads', `${uuidv4()}.mp3`);

        if (!ffmpegPath) {
            reject(new Error('FFmpeg no encontrado.'));
            return;
        }

        ffmpeg(filePath)
            .setFfmpegPath(ffmpegPath)
            .audioCodec('libmp3lame')
            .toFormat('mp3')
            .on('end', () => {
                console.log('Eliminación de codec opus completada');
                resolve(outputFilePath);
            })
            .on('error', (err: Error) => {
                console.error('Error al procesar el archivo:', err);
                reject(err);
            })
            .save(outputFilePath);
    });
}

async function uploadFileToS3(bucketName: string, filePath: string): Promise<string> {
    const s3Client = new S3Client({});
    try {
        const isImagen = await isNotImageFile(filePath);

        let processedFilePath;

        if (isImagen) {
            processedFilePath = await removeOpusCodec(filePath);
        }
        else {
            processedFilePath = filePath;
        }

        const fileContent = await readFile(processedFilePath);

        const originalFileName = basename(processedFilePath);
        const fileExtension = originalFileName.split('.').pop();

        const fileName = `${uuidv4()}.${fileExtension}`;
        const key = `uploads/${fileName}`;

        const uploadParams: PutObjectCommandInput = {
            Bucket: bucketName,
            Key: key,
            Body: fileContent,
            ContentType: `audio/${fileExtension}`
        };

        const command = new PutObjectCommand(uploadParams);
        await s3Client.send(command);

        const url = `https://${bucketName}.s3.amazonaws.com/${key}`;
        return url;
    } catch (error) {
        console.error("Error al subir el archivo a S3:", error);
        throw error;
    }
}

export default uploadFileToS3;