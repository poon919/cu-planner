import React from 'react'
import { actions } from '@storybook/addon-actions'

import ExportDialog from '../views/dialogs/ExportDialog'
import { TestAppState } from './story.data'

export default {
  component: ExportDialog,
  title: 'ExportDialog',
}

const props = actions('onClose')

export const Default = () => (
  <ExportDialog
    appState={TestAppState}
    open
    {...props}
  />
)
