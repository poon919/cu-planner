import React from 'react'
import { actions } from '@storybook/addon-actions'

import ConfirmDialog from '../views/dialogs/ConfirmDialog'

export default {
  component: ConfirmDialog,
  title: 'ConfirmDialog',
}

const props = actions('onClose', 'onConfirm')

export const Default = () => (
  <ConfirmDialog title="Please confirm your action" open {...props}>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
    ut labore et dolore magna aliqua. Rhoncus dolor purus non enim praesent elementum
    facilisis leo vel. Risus at ultrices mi tempus imperdiet.
  </ConfirmDialog>
)
