import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import uploadFileToS3 from '../../services/AWS/S3/uploadS3';
import { deleteFile } from '../../utils/deleteFile';

const prisma = new PrismaClient();

export const updateLead = async (req: Request, res: Response): Promise<void> => {
  const { numeroWhatsapp } = req.params;
  const { nombre, tipoGestion } = req.body;
  const urlPhotoPerfil = req.file?.path;

  try {
    const leadExists = await prisma.lead.findUnique({
      where: { numeroWhatsapp: numeroWhatsapp },
    });

    if (!leadExists) {
      res.status(404).json({ message: 'Lead no encontrado' });
      return;
    }

    const updateData: any = {};

    if (urlPhotoPerfil) {
      const bucketName = process.env.BUCKET_S3;

      if (!bucketName) {
        res.status(500).json({ message: 'Nombre de bucket S3 no definido' });
        return;
      }

      const imageUrl = await uploadFileToS3(bucketName, urlPhotoPerfil);
      updateData.urlPhotoPerfil = imageUrl;

      // eliminamos la imagen que queda localmente despus de la actualizacion en la base de datos.
      await deleteFile(urlPhotoPerfil);

    }

    if (nombre !== undefined) updateData.nombre = nombre;

    if (tipoGestion !== undefined) {
      const tipoGestionRecord = await prisma.tipoGestion.findUnique({
        where: { tipoGestion: tipoGestion },
      });

      if (tipoGestionRecord) {
        updateData.idTipoGestion = tipoGestionRecord.id;
      } else {
        res.status(400).json({ message: 'Tipo de gestión no encontrado' });
        return;
      }
    }

    await prisma.lead.update({
      where: { numeroWhatsapp: numeroWhatsapp },
      data: updateData,
    });

    res.status(200).json({ message: 'Lead actualizado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el lead', error });
  }
};