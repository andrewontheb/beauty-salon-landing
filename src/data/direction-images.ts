import hair from '../assets/categories/01-hair.webp';
import manicure from '../assets/categories/02-manicure.webp';
import pedicure from '../assets/categories/03-pedicure.webp';
import face from '../assets/categories/04-face.webp';
import brows from '../assets/categories/05-brows-lashes.webp';
import makeup from '../assets/categories/06-makeup.webp';
import depilation from '../assets/categories/07-depilation.webp';
import permanent from '../assets/categories/08-permanent-makeup.webp';
import piercing from '../assets/categories/09-piercing.webp';
import massage from '../assets/categories/10-massage.webp';
import type { ImageMetadata } from 'astro';

// Временные AI-иллюстрации, предоставленные пользователем; это не работы салона.
export const directionImages: Record<string, ImageMetadata> = {
  hair, manicure, pedicure, face, brows, makeup, depilation, permanent, piercing, massage,
};
