import { S3Client, DeleteObjectCommand, DeleteObjectCommandInput } from "@aws-sdk/client-s3";

async function deleteFileFromS3(bucketName: string, key: string): Promise<void> {
    const s3Client = new S3Client({});
    try {
        const deleteParams: DeleteObjectCommandInput = {
            Bucket: bucketName,
            Key: key,
        };

        const command = new DeleteObjectCommand(deleteParams);
        await s3Client.send(command);

        console.log(`Archivo con la clave ${key} eliminado correctamente del bucket ${bucketName}.`);
    } catch (error) {
        console.error("Error al eliminar el archivo de S3:", error);
        throw error;
    }
}

export default deleteFileFromS3;