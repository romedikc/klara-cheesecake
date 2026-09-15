import type { LessonDetail } from '../types'
import { images } from './images'
import { defaultMaterials } from './courses'
import { videoForLesson } from './videos'

/**
 * Full lesson bodies. Anything not listed here still plays via a fallback
 * built from the course program (title, module, duration).
 */
export const lessonDetails: Record<string, LessonDetail> = {
  'm2-crust': {
    id: 'm2-crust',
    courseId: 'foundations',
    title: 'Корж из крекеров',
    moduleTitle: 'Модуль 2. Нью-йоркский классик',
    lessonNumber: 5,
    totalLessons: 18,
    duration: '8:05',
    videoImage: images.cakeBasque,
    videoUrl: videoForLesson('m2-crust'),
    description: [
      'Корж держит всю конструкцию: если он рассыпается или, наоборот, превращается в камень, аккуратного куска не получится. В уроке показываю, как измельчить крекеры до нужной фракции, сколько масла добавить и почему корж нужно предварительно подпечь.',
      'Отдельно разбираем, как утрамбовать основание стаканом так, чтобы толщина была одинаковой по всей форме и у бортика не образовался толстый валик.',
      'Если под рукой нет крекеров «Грэм», подойдёт любое песочное печенье без начинки — соотношение масла остаётся тем же.',
    ],
    ingredients: [
      { name: 'Крекеры «Грэм»', amount: '200 г' },
      { name: 'Масло сливочное, растопленное', amount: '90 г' },
      { name: 'Сахар', amount: '40 г' },
      { name: 'Соль', amount: 'щепотка' },
    ],
    steps: [
      {
        title: 'Измельчите крекеры',
        text: 'в блендере до крупного песка — без больших кусков, но и не в пыль.',
      },
      {
        title: 'Смешайте',
        text: 'с сахаром, солью и растопленным маслом. Масса должна держать форму, если сжать её в кулаке.',
      },
      {
        title: 'Утрамбуйте',
        text: 'в форму 22 см: сначала дно, затем бортик 3 см стаканом с плоским дном.',
      },
      {
        title: 'Подпеките',
        text: '10 минут при 175 °C и полностью остудите перед заливкой начинки.',
      },
    ],
    materials: defaultMaterials,
  },
}
