export type CourseLevel = 'beginner' | 'middle' | 'advanced' | 'business'

export interface Product {
  id: string
  name: string
  /** Short category label shown above the name, e.g. "Классический". */
  tag: string
  /** Numeric price in som, used for cart math. */
  price: number
  description: string
  image: string
  /** Optional promo badge shown on the image, e.g. "Хит продаж". */
  badge?: string
  /** When true the badge uses the dark ink background instead of accent. */
  badgeDark?: boolean
  /** Marks the card CTA as the solid (primary) variant. */
  featured?: boolean
}

export interface Review {
  author: string
  /** Number of filled stars, 0–5. */
  rating: number
  text: string
  date: string
}

export interface ProductDetail extends Product {
  priceNote: string
  ratingValue: number
  reviewsCount: number
  longDescription: string[]
  gallery: string[]
  sizes: string[]
  defaultSizeIndex: number
  deliveryDates: string[]
  defaultDateIndex: number
  ingredients: string[]
  allergens: string
  reviews: Review[]
  relatedIds: string[]
}

export interface Course {
  id: string
  name: string
  level: CourseLevel
  levelLabel: string
  duration: string
  lessons: string
  description: string
  /** Shorter blurb used on the home page course list. */
  shortDescription: string
  tags: string[]
  price: number
  ratingValue: number
  reviewsCount: number
  image: string
}

export interface CourseLesson {
  id: string
  title: string
  /** "free" shows the "Бесплатно" tag, "locked" shows the padlock. */
  access: 'free' | 'locked'
  duration: string
}

export interface CourseMaterial {
  name: string
}

export interface LessonIngredient {
  name: string
  amount: string
}

export interface LessonStep {
  title: string
  text: string
}

export interface LessonDetail {
  id: string
  courseId: string
  title: string
  moduleTitle: string
  lessonNumber: number
  totalLessons: number
  duration: string
  videoImage: string
  /** Stream URL. Mocked today; later this comes from the API. */
  videoUrl: string
  description: string[]
  ingredients: LessonIngredient[]
  steps: LessonStep[]
  materials: CourseMaterial[]
}

export interface CourseModule {
  title: string
  meta: string
  lessons: CourseLesson[]
}

export interface CourseDetail extends Course {
  oldPrice: number
  students: number
  learnPoints: string[]
  modules: CourseModule[]
  includes: string[]
  materials: CourseMaterial[]
  author: {
    name: string
    bio: string
    avatar: string
  }
}

export interface Enrollment {
  courseId: string
  lastLessonId: string | null
  lastLessonTitle: string | null
}

export interface UserProfile {
  firstName: string
  lastName: string
  email: string
  initials: string
}

export type CartItemKind = 'product' | 'course'

export interface CartItem {
  id: string
  kind: CartItemKind
  name: string
  /** Secondary line, e.g. "Средний (8–10 порций) · 26 июня". */
  subtitle: string
  price: number
  image: string
  quantity: number
  /** Courses cannot change quantity. */
  fixedQuantity?: boolean

    testType?: string
}



