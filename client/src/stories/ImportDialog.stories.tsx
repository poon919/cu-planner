import React from 'react'
import { actions } from '@storybook/addon-actions'

import ImportDialog from '../views/dialogs/ImportDialog'

export default {
  component: ImportDialog,
  title: 'ImportDialog',
}

const props = actions('onClose', 'onImport')

export const Default = () => (
  <ImportDialog
    open
    {...props}
  />
)
