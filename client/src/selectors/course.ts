import { createSelector } from 'reselect'

import { AppState, Course } from '../models'

export const selectCourseCodes = createSelector(
  (appState: AppState) => appState.preset.courses,
  (appState: AppState) => appState.viewCourseCode,
  (courses, viewCourseCode) => {
    if (!viewCourseCode) {
      return courses
    }
    return [...courses, viewCourseCode]
  },
)

export const selectCoursesWithData = createSelector(
  (appState: AppState) => appState.preset.courses,
  (appState: AppState) => appState.courseData,
  (courses, courseData) => courses
    .reduce((acc, code) => {
      const result = courseData[code]
      if (result?.type !== 'success') {
        return acc
      }
      const { data } = result
      acc[code] = data
      return acc
    }, {} as Record<string, Course>),
)

export const isFetching = createSelector(
  (appState: AppState) => appState.courseData,
  (courseData) => Object
    .values(courseData)
    .some((result) => result?.type === 'fetching'),
)
