import { extname } from 'path';

/**
 * Verifica si un archivo no es un archivo de imagen.
 * @param filePath - La ruta del archivo a verificar.
 * @returns `true` si el archivo no es una imagen, `false` si es una imagen.
 */
function isNotImageFile(filePath: string): boolean {
    // Definir extensiones de archivos de imagen
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.webp'];

    // Obtener la extensión del archivo y convertirla a minúsculas
    const fileExtension = extname(filePath).toLowerCase();

    // Verificar si la extensión del archivo no está en la lista de extensiones de imagen
    return !imageExtensions.includes(fileExtension);
}

export default isNotImageFile;