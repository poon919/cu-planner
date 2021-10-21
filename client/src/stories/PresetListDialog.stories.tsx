import React, { useState } from 'react'
import { action, actions } from '@storybook/addon-actions'

import PresetListDialog from '../views/dialogs/PresetListDialog'
import { PresetInfo } from '../models'
import { TestPresets } from './story.data'

export default {
  component: PresetListDialog,
  title: 'PresetListDialog',
}

const useCommonProps = (initState: PresetInfo[]) => {
  const [presets, setPresets] = useState(initState)

  const handleDelete = (id: number) => {
    action('onDelete')(id)
    setPresets((state) => state.filter((p) => p.id !== id))
  }

  return {
    open: true,
    presets,
    onDeletePreset: handleDelete,
    ...actions(
      'onClose',
      'onCreatePreset',
      'onImportPreset',
      'onSelectPreset',
      'onEditPreset',
    ),
  }
}

export const Empty = () => {
  const props = useCommonProps([])
  return <PresetListDialog {...props} />
}

export const WithData = () => {
  const props = useCommonProps(TestPresets)
  return <PresetListDialog selected={15} {...props} />
}
