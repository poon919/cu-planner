import { Preset } from '../models'

const colorScheme = [
  '#FFCDD2',
  '#F8BBD0',
  '#E1BEE7',
  '#D1C4E9',
  '#C5CAE9',
  '#BBDEFB',
  '#B2EBF2',
  '#B2DFDB',
  '#C8E6C9',
  '#DCEDC8',
  '#F0F4C3',
  '#FFECB3',
  '#FFE0B2',
  '#FFCCBC',
] as const

export const defaultColor = '#bdbdbd'

export const selectCourseColor = (preset: Preset | undefined | null, code: string) => {
  if (!preset) {
    return defaultColor
  }

  const index = preset.courses.indexOf(code)
  return index < 0
    ? defaultColor
    : colorScheme[index % colorScheme.length]
}
