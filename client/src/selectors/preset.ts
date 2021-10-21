import { createSelector } from 'reselect'

import { Preset, PresetInfo } from '../models'

export const selectPresetInfo = createSelector(
  (preset: Preset) => preset.id,
  (preset: Preset) => preset.name,
  (preset: Preset) => preset.program,
  (preset: Preset) => preset.acadyear,
  (preset: Preset) => preset.semester,
  (id, name, program, acadyear, semester): PresetInfo => ({
    id, name, program, acadyear, semester,
  }),
)
