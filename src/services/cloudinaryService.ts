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
    backdropColor?: 'white' | 'neutral' | 'beige' | 'grey' | 'transparent';
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

  const transformations: string[] = [];

  // Background removal con IA PRIMERO (antes de resize)
  if (options?.removeBackground) {
    transformations.push('e_background_removal');

    // Aplicar color de fondo DESPUÉS del background removal
    if (options.backdropColor === 'white') {
      transformations.push('b_white');
    } else if (options.backdropColor === 'neutral') {
      // Neutral: #ebe7e8
      transformations.push('b_ebe7e8');
    } else if (options.backdropColor === 'beige') {
      // Beige: #f4ebd0
      transformations.push('b_f4ebd0');
    } else if (options.backdropColor === 'grey') {
      // Grey: #e8ecf2
      transformations.push('b_e8ecf2');
    } else if (options.backdropColor === 'transparent') {
      // Para transparente, no agregar background
    }
  }

  // Resize después del background removal
  transformations.push(`w_${width}`, `h_${height}`, 'c_fill', 'g_auto');

  // Agregar transformaciones adicionales con sintaxis correcta de Cloudinary
  if (options?.contrast) {
    transformations.push(`e_contrast:${options.contrast}`);
  }
  if (options?.saturation) {
    transformations.push(`e_saturation:${options.saturation}`);
  }
  if (options?.brightness) {
    transformations.push(`e_brightness:${options.brightness}`);
  }

  const transformationString = transformations.join('/');

  // Construir URL correctamente
  // PNG solo para fondo transparente, JPG para colores
  const format = options?.removeBackground && options?.backdropColor === 'transparent' ? 'png' : 'jpg';
  // Calidad: q_85 balanceo entre compresión y calidad
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transformationString}/q_85,f_${format},fl_attachment/${publicId}.${format}`;
}
