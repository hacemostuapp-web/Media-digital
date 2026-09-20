/**
 * Servicio para manejar uploads y transformaciones con Cloudinary
 */

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

// Verificar que las variables de entorno existan
if (!CLOUD_NAME) {
  console.error('VITE_CLOUDINARY_CLOUD_NAME no está configurado en .env.local');
}

/**
 * Sube una imagen a Cloudinary y retorna sus URLs transformadas
 */
export async function uploadPhotoToCloudinary(
  file: File
): Promise<{
  originalUrl: string;
  publicId: string;
}> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'studio_drop_photos');
  formData.append('folder', 'studiodrop/photos');

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error en upload: ${response.statusText}`);
    }

    const data = await response.json();
    const publicId = data.public_id;
    const originalUrl = data.secure_url;

    return {
      originalUrl,
      publicId,
    };
  } catch (error) {
    console.error('Error subiendo foto a Cloudinary:', error);
    throw error;
  }
}

/**
 * Obtiene una URL redimensionada para diferentes plataformas
 */
export function getResizedUrl(
  publicId: string,
  size: 'web' | 'stories' | 'pinterest',
  options?: {
    contrast?: number;
    saturation?: number;
    brightness?: number;
    removeBackground?: boolean;
  }
): string {
  let width = 1200;
  let height = 1600;

  if (size === 'stories') {
    width = 1080;
    height = 1440;
  } else if (size === 'pinterest') {
    width = 1000;
    height = 1333;
  }

  const transformations: string[] = [`w_${width}`, `h_${height}`, 'c_fill', 'g_auto'];

  // Agregar transformaciones adicionales
  if (options?.contrast) {
    transformations.push(`contrast:${options.contrast}`);
  }
  if (options?.saturation) {
    transformations.push(`saturation:${options.saturation}`);
  }
  if (options?.brightness) {
    transformations.push(`brightness:${options.brightness}`);
  }
  if (options?.removeBackground) {
    transformations.push('background_removal:cloudinary_ai');
  }

  const transformationString = transformations.join('/');

  // Construir URL con extensión y flag de descarga
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transformationString}/q_auto,f_jpg,fl_attachment/${publicId}.jpg`;
}
