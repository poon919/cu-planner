import { GridProps } from '@material-ui/core/Grid'

import {
  AppState,
  CourseFilter,
} from '../../models'

export interface CourseDetailProps extends GridProps {
  code: string
  appState?: AppState
  onFilterChange?: (code: string, filter: CourseFilter) => void
  onAddCourse: (code: string, filter: CourseFilter) => void
  onDeleteCourse: (code: string) => void
}
