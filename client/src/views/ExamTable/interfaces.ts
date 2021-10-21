import { AppState } from '../../models'

export interface ExamTableProps {
  appState: AppState
  onViewCourse: (code: string) => void
}
