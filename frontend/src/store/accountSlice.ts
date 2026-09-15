import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Enrollment, UserProfile } from '../types'
import { currentUser, initialEnrollments } from '../data/account'
import type { RootState } from './index'

interface AccountState {
  user: UserProfile
  enrollments: Enrollment[]
  lastPurchasedCourseId: string | null
}

const initialState: AccountState = {
  user: currentUser,
  enrollments: initialEnrollments,
  lastPurchasedCourseId: null,
}

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    enrollCourses: (state, action: PayloadAction<string[]>) => {
      for (const courseId of action.payload) {
        if (!state.enrollments.some((item) => item.courseId === courseId)) {
          state.enrollments.push({
            courseId,
            lastLessonId: null,
            lastLessonTitle: null,
          })
        }
      }
      state.lastPurchasedCourseId = action.payload[0] ?? state.lastPurchasedCourseId
    },
    setLastLesson: (
      state,
      action: PayloadAction<{ courseId: string; lessonId: string; lessonTitle: string }>,
    ) => {
      const enrollment = state.enrollments.find(
        (item) => item.courseId === action.payload.courseId,
      )
      if (enrollment) {
        enrollment.lastLessonId = action.payload.lessonId
        enrollment.lastLessonTitle = action.payload.lessonTitle
      }
    },
  },
})

export const { enrollCourses, setLastLesson } = accountSlice.actions

export default accountSlice.reducer

export const selectUser = (state: RootState) => state.account.user
export const selectEnrollments = (state: RootState) => state.account.enrollments
export const selectLastPurchasedCourseId = (state: RootState) =>
  state.account.lastPurchasedCourseId

export const selectEnrollmentByCourseId = (courseId: string) => (state: RootState) =>
  state.account.enrollments.find((item) => item.courseId === courseId)

export const selectIsEnrolled = (courseId: string) => (state: RootState) =>
  state.account.enrollments.some((item) => item.courseId === courseId)
