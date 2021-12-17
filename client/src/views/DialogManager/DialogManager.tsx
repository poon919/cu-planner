import React, { useState } from 'react'

import * as db from '../../db'
import { PresetInfo, Preset } from '../../models'
import { useValidSemester } from '../../hooks'
import ExportDialog from '../dialogs/ExportDialog'
import ImportDialog from '../dialogs/ImportDialog'
import PresetFormDialog from '../dialogs/PresetFormDialog'
import PresetListDialog from '../dialogs/PresetListDialog'
import { DialogType, DialogManagerProps } from './interfaces'

export const useDialog = () => {
  const [dialog, setDialog] = useState<DialogType | null>(null)

  const presetList = () => {
    setDialog({
      type: 'PresetList',
    })
  }

  const presetCreator = () => {
    setDialog({
      type: 'PresetForm',
      variant: 'create',
    })
  }

  const presetImporter = () => {
    setDialog({
      type: 'Import',
    })
  }

  const presetEditor = (preset: PresetInfo) => {
    setDialog({
      type: 'PresetForm',
      variant: 'edit',
      defaultValues: preset,
    })
  }

  const presetExporter = () => {
    setDialog({
      type: 'Export',
    })
  }

  const showDialog = (type: DialogType | null) => setDialog(type)
  showDialog.presetList = presetList
  showDialog.presetCreator = presetCreator
  showDialog.presetImporter = presetImporter
  showDialog.presetEditor = presetEditor
  showDialog.presetExporter = presetExporter

  const closeDialog = () => {
    setDialog(null)
  }

  return {
    dialog,
    showDialog,
    closeDialog,
  }
}

const DialogManager = ({
  dialog,
  presets,
  appState,
  onClose,
  onSwitchDialog,
  onSelectPreset,
  onPresetUpdated,
}: DialogManagerProps) => {
  const open = !!dialog
  const validSemesters = useValidSemester()

  switch (dialog?.type) {
    case 'Export': {
      if (!appState) {
        break
      }

      return (
        <ExportDialog
          open={open}
          onClose={onClose}
          appState={appState}
        />
      )
    }
    case 'Import': {
      const handleImport = (preset: Omit<Preset, 'id'>) => {
        onSwitchDialog({
          type: 'PresetForm',
          variant: 'import',
          defaultValues: preset,
        })
      }

      return (
        <ImportDialog
          open={open}
          onClose={onClose}
          onImport={handleImport}
        />
      )
    }
    case 'PresetForm': {
      let handleSubmit: (values: Omit<PresetInfo, 'id'>) => void = () => null
      switch (dialog.variant) {
        case 'create':
        case 'import': {
          handleSubmit = async (values: Omit<PresetInfo, 'id'>) => {
            const { defaultValues } = dialog
            const preset = await db.addPreset({ ...defaultValues, ...values })
            const { id } = preset
            onPresetUpdated?.(id, 'added')
          }
          break
        }
        case 'edit': {
          handleSubmit = async (values: Omit<PresetInfo, 'id'>) => {
            const { id } = dialog.defaultValues
            await db.updatePreset(id, values)
            onPresetUpdated?.(id, 'edited')
          }
          break
        }
        default:
          break
      }

      const { variant, defaultValues } = dialog

      return (
        <PresetFormDialog
          open={open}
          onClose={onClose}
          variant={variant}
          defaultValues={defaultValues}
          validSemesters={validSemesters}
          onSubmit={handleSubmit}
        />
      )
    }
    case 'PresetList': {
      const handleCreatePreset = () => {
        onSwitchDialog({
          type: 'PresetForm',
          variant: 'create',
        })
      }

      const handleImportPreset = () => {
        onSwitchDialog({
          type: 'Import',
        })
      }

      const handleEditPreset = async (id: number) => {
        const preset = await db.getPreset(id)
        if (!preset) {
          return
        }
        onSwitchDialog({
          type: 'PresetForm',
          variant: 'edit',
          defaultValues: preset,
        })
      }

      const handleDeletePreset = async (id: number) => {
        await db.deletePreset(id)
        onPresetUpdated?.(id, 'deleted')
      }

      return (
        <PresetListDialog
          open={open}
          onClose={onClose}
          presets={presets}
          selected={appState?.preset.id}
          onSelectPreset={onSelectPreset}
          onCreatePreset={handleCreatePreset}
          onImportPreset={handleImportPreset}
          onEditPreset={handleEditPreset}
          onDeletePreset={handleDeletePreset}
        />
      )
    }
    default: {
      break
    }
  }
  return null
}

export default DialogManager
