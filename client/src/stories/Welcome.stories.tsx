import React from 'react'
import { actions } from '@storybook/addon-actions'

import Welcome from '../views/Welcome'
import { TestPresets } from './story.data'

export default {
  component: Welcome,
  title: 'Welcome',
}

const props = actions('onCreatePreset', 'onImportPreset', 'onShowPresets')

export const FirstVisit = () => (
  <Welcome presets={[]} {...props} />
)

export const WithPresets = () => (
  <Welcome presets={TestPresets} {...props} />
)
