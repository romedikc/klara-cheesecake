import type { CartItem } from '../types'
import { images } from './images'

/** Flat delivery fee, matching the original checkout copy. */
export const DELIVERY_COST = 300

/**
 * Seed cart contents. Mirrors the two items shown in the original static
 * cart/checkout templates (a Basque cheesecake + the Foundations course).
 */
export const initialCartItems: CartItem[] = [
  {
    id: 'basque',
    kind: 'product',
    name: 'Баскский чизкейк',
    subtitle: 'Средний (8–10 порций) · 26 июня',
    price: 1900,
    image: images.cakeBasque,
    quantity: 1,
  },
  {
    id: 'foundations',
    kind: 'course',
    name: 'Основы чизкейка',
    subtitle: 'Онлайн-курс · Доступ навсегда',
    price: 6900,
    image: images.courseFoundations,
    quantity: 1,
    fixedQuantity: true,
  },
]
