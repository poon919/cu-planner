import React from 'react'
import { actions } from '@storybook/addon-actions'

import PresetFormDialog from '../views/dialogs/PresetFormDialog'

export default {
  component: PresetFormDialog,
  title: 'PresetFormDialog',
}

const props = actions('onClose', 'onCancel', 'onSubmit')

const VALID_SEMESTERS = [
  'T20191', 'T20192', 'S20203', 'T20201', 'S20192', 'S20202',
  'T20193', 'I20203', 'S20193', 'I20201', 'T20202', 'I20193',
  'I20202', 'S20201', 'I20191', 'I20192', 'T20203', 'S20191',
]

export const Default = () => (
  <PresetFormDialog
    validSemesters={VALID_SEMESTERS}
    open
    {...props}
  />
)

export const WithDefaultValues = () => (
  <PresetFormDialog
    defaultValues={{
      name: 'Preset A',
      program: 'T',
      acadyear: 2020,
      semester: '2',
    }}
    validSemesters={VALID_SEMESTERS}
    open
    {...props}
  />
)
