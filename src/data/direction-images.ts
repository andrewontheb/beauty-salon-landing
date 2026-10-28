import hair from '../assets/categories/hair.webp';
import manicure from '../assets/categories/manicure.webp';
import pedicure from '../assets/categories/pedicure.webp';
import face from '../assets/categories/face.webp';
import brows from '../assets/categories/brows.webp';
import makeup from '../assets/categories/makeup.webp';
import depilation from '../assets/categories/depilation.webp';
import permanent from '../assets/categories/permanent.webp';
import piercing from '../assets/categories/piercing.webp';
import massage from '../assets/categories/massage.webp';
import type { ImageMetadata } from 'astro';

// Комплект beauty-categories-v2.zip: AI-миниатюры 275–278 × 455 px, без увеличения.
// Происхождение хранится здесь; это не фотографии работ салона.
export const directionImages: Record<string, ImageMetadata> = {
  hair, manicure, pedicure, face, brows, makeup, depilation, permanent, piercing, massage,
};
