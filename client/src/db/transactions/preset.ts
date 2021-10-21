import {
  CourseFilter,
  Preset,
  PresetInfo,
} from '../../models'
import { getAppDB, autoIncPK } from '../db'

type MayBeIdentifiable = { id?: any }

const omitID = <T extends MayBeIdentifiable>(o: T) => {
  const { id: omitted, ...rest } = o
  return rest
}

const extractPresetInfo = (preset: Preset): PresetInfo => {
  const {
    courses,
    filters,
    ...presetInfo
  } = preset

  return presetInfo
}

export const getAllPresetInfo = async (): Promise<PresetInfo[]> => {
  const db = await getAppDB()
  const result: PresetInfo[] = []
  let cursor = await db.transaction('preset').store.openCursor()
  while (cursor) {
    result.push(extractPresetInfo(cursor.value))
    cursor = await cursor.continue() // eslint-disable-line no-await-in-loop
  }
  return result
}

export const getPresetInfo = async (
  id: number,
): Promise<PresetInfo | undefined> => {
  const db = await getAppDB()
  const preset = await db.get('preset', id)
  return preset && extractPresetInfo(preset)
}

export const getPreset = async (
  id: number,
): Promise<Preset | undefined> => {
  const db = await getAppDB()
  const preset = await db.get('preset', id)
  return preset
}

export const addPreset = async (
  preset: Partial<Preset> & Omit<PresetInfo, 'id'>,
): Promise<Preset> => {
  const db = await getAppDB()
  const { courses, filters, ...others } = omitID(preset)
  const newPreset = {
    ...others,
    courses: courses || [],
    filters: filters || {},
  }
  const id = await db.add('preset', autoIncPK('id', newPreset))
  return {
    id,
    ...newPreset,
  }
}

export const deletePreset = async (
  id: number,
) => {
  const db = await getAppDB()
  return db.delete('preset', id)
}

export const updatePreset = async (
  id: number,
  preset: Partial<Preset>,
) => {
  const db = await getAppDB()
  const store = db
    .transaction('preset', 'readwrite')
    .objectStore('preset')
  if (await store.count(id) === 0) {
    throw new Error('Preset not found')
  }
  const old = await store.get(id) as Preset
  const updated = {
    ...old,
    ...omitID(preset),
  }

  store.put(updated)
  return updated
}

export const clearPresets = async () => {
  const db = await getAppDB()
  return db.clear('preset')
}

export const addPresetCourse = async (
  id: number,
  code: string,
  filter: CourseFilter = { section: '', keyword: '' },
) => {
  const db = await getAppDB()
  const store = db
    .transaction('preset', 'readwrite')
    .objectStore('preset')
  if (await store.count(id) === 0) {
    throw new Error('Preset not found')
  }

  const preset = await store.get(id) as Preset
  preset.courses.push(code)
  preset.filters[code] = filter

  store.put(preset)
  return preset
}

export const deletePresetCourse = async (
  id: number,
  code: string,
) => {
  const db = await getAppDB()
  const store = db
    .transaction('preset', 'readwrite')
    .objectStore('preset')
  if (await store.count(id) === 0) {
    throw new Error('Preset not found')
  }

  const preset = await store.get(id) as Preset
  preset.courses = preset.courses.filter((c) => c !== code)
  delete preset.filters[code]

  store.put(preset)
  return preset
}

export const updatePresetFilters = async (
  id: number,
  filters: Record<string, CourseFilter>,
) => {
  const db = await getAppDB()
  const store = db
    .transaction('preset', 'readwrite')
    .objectStore('preset')
  if (await store.count(id) === 0) {
    throw new Error('Preset not found')
  }

  const preset = await store.get(id) as Preset
  preset.filters = {
    ...preset.filters,
    ...filters,
  }

  store.put(preset)
  return preset
}
