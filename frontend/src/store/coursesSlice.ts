import { createSlice } from '@reduxjs/toolkit'
import type { Course, CourseDetail } from '../types'
import { courses, courseDetails } from '../data/courses'
import type { RootState } from './index'

interface CoursesState {
  items: Course[]
  details: Record<string, CourseDetail>
}

// Seeded from mock data for now. Swap for an axios-backed async thunk later.
const initialState: CoursesState = {
  items: courses,
  details: courseDetails,
}

const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {},
})

export default coursesSlice.reducer

export const selectCourses = (state: RootState) => state.courses.items

export const selectCourseById = (id: string) => (state: RootState) =>
  state.courses.items.find((c) => c.id === id)

export const selectCourseDetail = (id: string) => (state: RootState) =>
  state.courses.details[id]
