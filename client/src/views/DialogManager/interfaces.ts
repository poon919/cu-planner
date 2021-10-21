import { AppState, PresetInfo } from '../../models'
import { PresetFormDialogProps } from '../dialogs/PresetFormDialog'

export interface ExportDialogType {
  type: 'Export'
}

export interface ImportDialogType {
  type: 'Import'
}

export interface AddPresetFormtDialogType extends Pick<
  PresetFormDialogProps, 'variant'
> {
  type: 'PresetForm'
  variant: 'create' | 'import'
  defaultValues?: Omit<PresetInfo, 'id'>
}

export interface EditPresetFormtDialogType extends Pick<
  PresetFormDialogProps, 'variant'
> {
  type: 'PresetForm'
  variant: 'edit'
  defaultValues: PresetInfo
}

export interface PresetListDialogType {
  type: 'PresetList'
}

export type DialogType = ExportDialogType
| ImportDialogType
| AddPresetFormtDialogType
| EditPresetFormtDialogType
| PresetListDialogType

export type PresetUpdateAction = 'added' | 'edited' | 'deleted'

export interface DialogManagerProps {
  dialog?: DialogType | null
  presets: PresetInfo[]
  appState?: AppState | null
  onClose?: () => void
  onSwitchDialog: (dialog: DialogType) => void
  onSelectPreset: (id: number) => void
  onPresetUpdated?: (id: number, action: PresetUpdateAction) => void
}
