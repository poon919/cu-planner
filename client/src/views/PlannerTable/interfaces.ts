import { CourseFilter, AppState } from '../../models'

export interface PlannerTableProps {
  appState: AppState
  onViewCourse: (code: string) => void
  onFilterChange: (code: string, filter: CourseFilter) => void
}
