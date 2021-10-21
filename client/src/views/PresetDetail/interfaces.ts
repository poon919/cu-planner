import { AppState, PresetInfo, Preset } from '../../models'

export interface PresetDetailProps {
  appState: AppState
  onRefresh: (code: string) => void
  onViewCourse: (code: string) => void
  onDeleteCourse: (code: string) => void
  onEditPreset: (preset: PresetInfo) => void
  onExportPreset: (preset: Preset) => void
}
