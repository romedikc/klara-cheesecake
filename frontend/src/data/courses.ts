import type { Course, CourseDetail, CourseMaterial } from '../types'
import { images } from './images'

export const defaultMaterials: CourseMaterial[] = [
  { name: 'Рецепты, 4 стиля (PDF)' },
  { name: 'Чек-лист покупок (PDF)' },
  { name: 'Таблица температур (PDF)' },
]

const author = {
  name: 'Клара',
  bio: '10 лет выпечки, 12 000 учеников и один принцип: чизкейк должен дрожать, а не стоять по стойке смирно. Веду студию в Москве и онлайн-курсы по всему миру.',
  avatar: images.portrait,
}

export const courses: Course[] = [
  {
    id: 'foundations',
    name: 'Основы чизкейка',
    level: 'beginner',
    levelLabel: 'Начальный',
    duration: '2 ч 10 мин',
    lessons: '18 уроков',
    description:
      'Освойте четыре классических стиля и забудьте о трещинах. Идеально если вы печёте впервые — Клара объясняет каждый шаг так, будто стоит рядом.',
    shortDescription: 'Освойте четыре классических стиля и забудьте о трещинах.',
    tags: ['Нью-йорк стайл', 'Без выпечки', 'Японский', 'Баскский'],
    price: 6900,
    ratingValue: 4.9,
    reviewsCount: 841,
    image: images.courseFoundations,
  },
  {
    id: 'basque',
    name: 'Идеальный баскский',
    level: 'middle',
    levelLabel: 'Средний',
    duration: '3 ч 05 мин',
    lessons: '24 урока',
    description:
      'Текстура, тайминг и та самая карамельная корочка. Разберём физику выпечки, почему трескается, как добиться жидкой середины без сырости.',
    shortDescription: 'Текстура, тайминг и та самая карамельная корочка.',
    tags: ['Температурные режимы', 'Текстура', 'Подача'],
    price: 8900,
    ratingValue: 4.9,
    reviewsCount: 612,
    image: images.courseBasque,
  },
  {
    id: 'seasonal',
    name: 'Подача и сезон',
    level: 'advanced',
    levelLabel: 'Продвинутый',
    duration: '4 ч 20 мин',
    lessons: '31 урок',
    description:
      'Ресторанная подача, глазури и работа с фруктами. Научитесь работать с сезонными ягодами, делать зеркальную глазурь и оформлять как профи.',
    shortDescription: 'Ресторанная подача, глазури и работа с фруктами.',
    tags: ['Глазурь', 'Декор', 'Фрукты', 'Фото еды'],
    price: 11900,
    ratingValue: 5.0,
    reviewsCount: 389,
    image: images.courseSeasonal,
  },
  {
    id: 'business',
    name: 'Продавайте из своей кухни',
    level: 'business',
    levelLabel: 'Бизнес',
    duration: '2 ч 40 мин',
    lessons: '21 урок',
    description:
      'Цены, упаковка и доставка домашней пекарни. Как выйти на первых клиентов, вести учёт и не выгореть за первый месяц работы.',
    shortDescription: 'Цены, упаковка и доставка домашней пекарни.',
    tags: ['Ценообразование', 'Упаковка', 'Продвижение'],
    price: 9900,
    ratingValue: 4.8,
    reviewsCount: 274,
    image: images.courseBusiness,
  },
]

export const courseLevels = ['Все курсы', 'Начальный', 'Средний', 'Продвинутый', 'Бизнес']

const foundations: CourseDetail = {
  ...courses[0],
  levelLabel: 'Начальный уровень',
  oldPrice: 9900,
  students: 3241,
  description:
    'Освойте четыре классических стиля чизкейка и забудьте о трещинах и опавших серединах. Клара объясняет каждый шаг так, будто стоит рядом на вашей кухне.',
  learnPoints: [
    'Печь нью-йоркский чизкейк без трещин',
    'Баскский с правильной корочкой',
    'Чизкейк без выпечки — за 30 минут',
    'Японский «хлопковый» чизкейк',
    'Правильно выбирать сливочный сыр',
    'Хранить и подавать как профи',
  ],
  modules: [
    {
      title: 'Модуль 1. Введение и ингредиенты',
      meta: '4 урока · 28 мин',
      lessons: [
        { id: 'm1-welcome', title: 'Добро пожаловать в курс', access: 'free', duration: '4:10' },
        { id: 'm1-cheese', title: 'Выбираем сливочный сыр', access: 'free', duration: '7:20' },
        { id: 'm1-tools', title: 'Инструменты и оборудование', access: 'locked', duration: '6:40' },
        {
          id: 'm1-temp',
          title: 'Температура ингредиентов — главный секрет',
          access: 'locked',
          duration: '9:50',
        },
      ],
    },
    {
      title: 'Модуль 2. Нью-йоркский классик',
      meta: '5 уроков · 42 мин',
      lessons: [
        { id: 'm2-crust', title: 'Корж из крекеров', access: 'locked', duration: '8:05' },
        { id: 'm2-filling', title: 'Замешиваем начинку', access: 'locked', duration: '9:30' },
        { id: 'm2-waterbath', title: 'Водяная баня и выпечка', access: 'locked', duration: '11:15' },
        { id: 'm2-chill', title: 'Охлаждение и нарезка', access: 'locked', duration: '6:20' },
        { id: 'm2-errors', title: 'Разбор ошибок', access: 'locked', duration: '7:00' },
      ],
    },
    {
      title: 'Модуль 3. Баскский чизкейк',
      meta: '4 урока · 35 мин',
      lessons: [
        { id: 'm3-hightemp', title: 'Почему высокая температура', access: 'locked', duration: '7:45' },
        { id: 'm3-batter', title: 'Тесто и форма', access: 'locked', duration: '8:30' },
        { id: 'm3-bake', title: 'Выпечка и контроль', access: 'locked', duration: '10:10' },
        { id: 'm3-serve', title: 'Как подать правильно', access: 'locked', duration: '8:35' },
      ],
    },
    {
      title: 'Модуль 4. Без выпечки и японский',
      meta: '5 уроков · 45 мин',
      lessons: [
        { id: 'm4-nobake', title: 'Чизкейк без выпечки — базовый', access: 'locked', duration: '9:00' },
        { id: 'm4-variations', title: 'Вариации и топпинги', access: 'locked', duration: '8:15' },
        { id: 'm4-japanese', title: 'Японский «хлопковый»', access: 'locked', duration: '11:40' },
        { id: 'm4-meringue', title: 'Меренга и техника складывания', access: 'locked', duration: '9:05' },
        { id: 'm4-wrap', title: 'Итоги и что дальше', access: 'locked', duration: '7:00' },
      ],
    },
  ],
  includes: [
    '18 видео-уроков (2 ч 10 мин)',
    'PDF-рецепты для печати',
    'Доступ навсегда',
    'Доступ с телефона и ПК',
    'Закрытый чат студентов',
    'Сертификат об окончании',
  ],
  materials: defaultMaterials,
  author,
}

const basque: CourseDetail = {
  ...courses[1],
  levelLabel: 'Средний уровень',
  oldPrice: 11900,
  students: 2104,
  learnPoints: [
    'Поймать карамельную корочку без горечи',
    'Считать температуру и время, а не «на глаз»',
    'Добиться жидкой середины без сырости',
    'Выбрать форму и бумагу без протечек',
    'Остужать так, чтобы торт не осел',
    'Подавать баскский как в ресторане',
  ],
  modules: [
    {
      title: 'Модуль 1. Физика баскского',
      meta: '4 урока · 32 мин',
      lessons: [
        { id: 'basque-why', title: 'Почему высокая температура', access: 'free', duration: '7:45' },
        { id: 'basque-cheese', title: 'Сыр и жирность', access: 'free', duration: '8:10' },
        { id: 'basque-pan', title: 'Форма и бумага', access: 'locked', duration: '6:40' },
        { id: 'basque-temp', title: 'Температурные режимы', access: 'locked', duration: '9:20' },
      ],
    },
    {
      title: 'Модуль 2. Тесто и выпечка',
      meta: '4 урока · 36 мин',
      lessons: [
        { id: 'basque-batter', title: 'Тесто и форма', access: 'locked', duration: '8:30' },
        { id: 'basque-bake', title: 'Выпечка и контроль', access: 'locked', duration: '10:10' },
        { id: 'basque-crust', title: 'Корочка без горечи', access: 'locked', duration: '8:50' },
        { id: 'basque-center', title: 'Жидкая середина', access: 'locked', duration: '8:20' },
      ],
    },
    {
      title: 'Модуль 3. Подача',
      meta: '4 урока · 27 мин',
      lessons: [
        { id: 'basque-chill', title: 'Охлаждение', access: 'locked', duration: '6:15' },
        { id: 'basque-slice', title: 'Нарезка', access: 'locked', duration: '5:40' },
        { id: 'basque-serve', title: 'Как подать правильно', access: 'locked', duration: '8:35' },
        { id: 'basque-errors', title: 'Разбор ошибок', access: 'locked', duration: '6:50' },
      ],
    },
  ],
  includes: [
    '12 видео-уроков (1 ч 35 мин)',
    'PDF-рецепт баскского',
    'Доступ навсегда',
    'Таблица температур',
  ],
  materials: [
    { name: 'Рецепт баскского (PDF)' },
    { name: 'Таблица температур (PDF)' },
    { name: 'Чек-лист покупок (PDF)' },
  ],
  author,
}

const seasonal: CourseDetail = {
  ...courses[2],
  levelLabel: 'Продвинутый уровень',
  oldPrice: 14900,
  students: 1560,
  learnPoints: [
    'Работать с сезонными ягодами без воды в начинке',
    'Делать зеркальную глазурь',
    'Собирать ресторанную тарелку',
    'Сочетать травы и цитрус',
    'Фотографировать торт для витрины',
    'Менять меню по сезонам',
  ],
  modules: [
    {
      title: 'Модуль 1. Сезон и вкус',
      meta: '4 урока · 30 мин',
      lessons: [
        { id: 'seasonal-map', title: 'Карта сезонов', access: 'free', duration: '6:20' },
        { id: 'seasonal-berries', title: 'Ягоды и травы', access: 'free', duration: '8:40' },
        { id: 'seasonal-citrus', title: 'Цитрус и кислота', access: 'locked', duration: '7:10' },
        { id: 'seasonal-balance', title: 'Баланс сладости', access: 'locked', duration: '7:50' },
      ],
    },
    {
      title: 'Модуль 2. Глазурь и декор',
      meta: '5 уроков · 44 мин',
      lessons: [
        { id: 'seasonal-glaze', title: 'Зеркальная глазурь', access: 'locked', duration: '11:20' },
        { id: 'seasonal-fruit', title: 'Работа с фруктами', access: 'locked', duration: '9:05' },
        { id: 'seasonal-plate', title: 'Ресторанная подача', access: 'locked', duration: '8:30' },
        { id: 'seasonal-photo', title: 'Фото еды', access: 'locked', duration: '7:45' },
        { id: 'seasonal-menu', title: 'Сезонное меню', access: 'locked', duration: '7:20' },
      ],
    },
  ],
  includes: [
    '14 видео-уроков (1 ч 50 мин)',
    'PDF с сезонными формулами',
    'Доступ навсегда',
    'Референсы подачи',
  ],
  materials: [
    { name: 'Сезонные формулы (PDF)' },
    { name: 'Чек-лист глазури (PDF)' },
    { name: 'Референсы подачи (PDF)' },
  ],
  author,
}

const business: CourseDetail = {
  ...courses[3],
  levelLabel: 'Бизнес',
  oldPrice: 12900,
  students: 980,
  learnPoints: [
    'Считать себестоимость без убытка',
    'Собрать витрину и упаковку',
    'Принять первый заказ спокойно',
    'Настроить доставку',
    'Не выгореть в первый месяц',
    'Говорить о цене без стеснения',
  ],
  modules: [
    {
      title: 'Модуль 1. Цифры',
      meta: '5 уроков · 38 мин',
      lessons: [
        { id: 'biz-cost', title: 'Себестоимость', access: 'free', duration: '8:20' },
        { id: 'biz-price', title: 'Цена и маржа', access: 'free', duration: '9:10' },
        { id: 'biz-pack', title: 'Упаковка', access: 'locked', duration: '6:40' },
        { id: 'biz-orders', title: 'Первые заказы', access: 'locked', duration: '7:30' },
        { id: 'biz-delivery', title: 'Доставка', access: 'locked', duration: '6:20' },
      ],
    },
    {
      title: 'Модуль 2. Витрина',
      meta: '4 урока · 32 мин',
      lessons: [
        { id: 'biz-shop', title: 'Витрина и фото', access: 'locked', duration: '8:00' },
        { id: 'biz-copy', title: 'Тексты о торте', access: 'locked', duration: '7:15' },
        { id: 'biz-clients', title: 'Клиенты и повтор', access: 'locked', duration: '8:45' },
        { id: 'biz-burnout', title: 'Как не выгореть', access: 'locked', duration: '8:00' },
      ],
    },
  ],
  includes: [
    '16 видео-уроков',
    'Таблица себестоимости',
    'Доступ навсегда',
    'Шаблоны для заказов',
  ],
  materials: [
    { name: 'Таблица себестоимости (PDF)' },
    { name: 'Шаблоны заказов (PDF)' },
    { name: 'Чек-лист запуска (PDF)' },
  ],
  author,
}

export const courseDetails: Record<string, CourseDetail> = {
  foundations,
  basque,
  seasonal,
  business,
}
