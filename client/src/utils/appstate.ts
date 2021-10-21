import {
  AppState,
  CourseFilter,
} from '../models'

import { selectCourseFilter } from '../selectors/filter'

export const updateAppFilter = (
  state: AppState | null,
  code: string,
  filter: Partial<CourseFilter>,
) => {
  if (!state) {
    return null
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
