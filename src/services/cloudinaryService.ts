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
  noBackgroundUrl: string;
  publicId: string;
}> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'studio_drop_photos'); // Sin firmar - solo upload básico
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

    // URL original
    const originalUrl = data.secure_url;

    // URL con background removal automático
    const noBackgroundUrl = buildCloudinaryUrl(publicId, {
      background_removal: 'cloudinary_ai',
      quality: 'auto',
      fetch_format: 'auto',
    });

    return {
      originalUrl,
      noBackgroundUrl,
      publicId,
    };
  } catch (error) {
    console.error('Error subiendo foto a Cloudinary:', error);
    throw error;
  }
}

/**
 * Construye una URL de transformación de Cloudinary
 */
export function buildCloudinaryUrl(
  publicId: string,
  transformations: Record<string, string | number> = {}
): string {
  const params = new URLSearchParams();
  Object.entries(transformations).forEach(([key, value]) => {
    params.append(key, String(value));
  });

  const queryString = params.toString() ? `?${params.toString()}` : '';
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto/${publicId}${queryString}`;
}

/**
 * Obtiene una URL con transformaciones específicas (contraste, saturación, etc)
 */
export function getTransformedUrl(
  publicId: string,
  options: {
    contrast?: number;
    saturation?: number;
    brightness?: number;
    removeBackground?: boolean;
    quality?: number;
  } = {}
): string {
  const transformations: string[] = [];

  // Contraste (-100 a 100 en Cloudinary)
  if (options.contrast) {
    transformations.push(`contrast:${options.contrast}`);
  }

  // Saturación (-100 a 100 en Cloudinary)
  if (options.saturation) {
    transformations.push(`saturation:${options.saturation}`);
  }

  // Brillo (-100 a 100 en Cloudinary)
  if (options.brightness) {
    transformations.push(`brightness:${options.brightness}`);
  }

  // Remover fondo
  if (options.removeBackground) {
    transformations.push('background_removal:cloudinary_ai');
  }

  const transformationString = transformations.join('/');
  const quality = options.quality || 'auto';

  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transformationString}/q_${quality}/f_auto/${publicId}`;
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

  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transformationString}/q_auto/f_auto/${publicId}`;
}
