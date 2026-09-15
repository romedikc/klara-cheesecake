import type { Enrollment, UserProfile } from '../types'

/** Mock signed-in student. Swap for a `/me` API response later. */
export const currentUser: UserProfile = {
  firstName: 'Полина',
  lastName: 'Новикова',
  email: 'you@email.com',
  initials: 'П',
}

/**
 * Seeded enrollments so «Мои курсы» matches the Klara HTML.
 * Empty the array to see the empty state.
 */
export const initialEnrollments: Enrollment[] = [
  {
    courseId: 'foundations',
    lastLessonId: 'm2-crust',
    lastLessonTitle: 'Корж из крекеров',
  },
  {
    courseId: 'basque',
    lastLessonId: null,
    lastLessonTitle: null,
  },
  {
    courseId: 'seasonal',
    lastLessonId: 'seasonal-berries',
    lastLessonTitle: 'Ягоды и травы',
  },
]
