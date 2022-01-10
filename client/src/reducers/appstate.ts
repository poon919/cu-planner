import {
  AppState,
  Preset,
  PresetInfo,
  CourseFilter,
  CourseFetchState,
} from '../models'
import { selectCourseFilter } from '../selectors'

const verifyState = (
  state: AppState,
  ref?: PresetInfo,
) => {
  if (!ref) {
    return true
  }
  const { preset } = state
  return ref.program === preset.program
    && ref.acadyear === preset.acadyear
    && ref.semester === preset.semester
}

export const setPreset = (
  state: AppState | null,
  preset: Preset,
) => {
  if (!state) {
    return state
  }
  return { ...state, preset }
}

export const viewCourse = (
  state: AppState | null,
  viewCourseCode: string,
) => {
  if (!state) {
    return state
  }
  return { ...state, viewCourseCode }
}

export const updateAppFilter = (
  state: AppState | null,
  code: string,
  filter: Partial<CourseFilter>,
  ref?: PresetInfo,
) => {
  if (!state || !verifyState(state, ref)) {
    return state
  }
  if (state.preset.courses.indexOf(code) < 0) {
    return state
  }
  return {
    ...state,
    preset: {
      ...state.preset,
      filters: {
        ...state.preset.filters,
        [code]: {
          ...selectCourseFilter(code, state.preset.filters),
          ...filter,
        },
      },
    },
  }
}

export const setCourseData = (
  state: AppState | null,
  code: string,
  result: CourseFetchState,
  ref?: PresetInfo,
) => {
  if (!state || !verifyState(state, ref)) {
    return state
  }
  return {
    ...state,
    courseData: { ...state.courseData, [code]: result },
  }
}

export const deleteCourseData = (
  state: AppState | null,
  code: string,
  ref?: PresetInfo,
) => {
  if (!state || !verifyState(state, ref) || state.preset.courses.indexOf(code) >= 0) {
    return state
  }
  const { [code]: deleted, ...others } = state.courseData
  return { ...state, courseData: others }
}
