import { AppState } from '../../models'

export interface CourseFinderProps extends React.ComponentPropsWithoutRef<'div'> {
  appState: AppState
  onViewCourse: (code: string) => void
  onAddCourse: (code: string) => void
  onDeleteCourse: (code: string) => void
}
