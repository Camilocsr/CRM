import fs from 'fs/promises';

/**
 * Elimina un archivo en la ruta especificada.
 * @param filePath La ruta completa del archivo a eliminar.
 * @returns Una promesa que se resuelve con true si el archivo se eliminó con éxito, 
 *          o false si el archivo no existía. Rechaza la promesa si hay un error.
 */
export async function deleteFile(filePath: string): Promise<boolean> {
  try {
    await fs.unlink(filePath);
    console.log(`Archivo eliminado con éxito: ${filePath}`);
    return true;
  } catch (error) {
    if (error instanceof Error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        console.log(`El archivo no existe: ${filePath}`);
        return false;
      } else {
        console.error(`Error al eliminar el archivo ${filePath}:`, error.message);
        throw error;
      }
    } else {
      console.error(`Error desconocido al eliminar el archivo ${filePath}`);
      throw error;
    }
  }
}