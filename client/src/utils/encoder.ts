import LZString from 'lz-string'

import { Preset, Program, Semester } from '../models'
import { currentAcadyear } from './datetime'

export const encodePreset = (preset: Preset) => {
  const ENCODE_VERSION = 1

  const {
    name,
    program,
    semester,
    courses,
  } = preset
  let data = courses.reduce((acc, code) => acc + code, `${program}:${semester}:`)
  data += `:${name}`
  const jsonstr = JSON.stringify(data)
  const compressed = LZString.compressToBase64(jsonstr)
  return `${ENCODE_VERSION}:${compressed}`
}

const decodeV1 = (compressed: string): Omit<Preset, 'id'> | null => {
  const jsonstr = LZString.decompressFromBase64(compressed)
  if (jsonstr === null) {
    return null
  }
  const data: string = JSON.parse(jsonstr)

  const reDataV1 = /([STI]):([123]):(\d*?):(.+)/g
  const reCourseCode = /\d{7}/g

  const { value, done } = data.matchAll(reDataV1).next()
  if (done) {
    return null
  }
  const [
    fullMatch, // eslint-disable-line
    program,
    semester,
    codes,
    name,
  ] = value as string[]

  return {
    name,
    program: program as Program,
    semester: semester as Semester,
    acadyear: currentAcadyear,
    courses: codes.match(reCourseCode) || [],
    filters: {},
  }
}

export const decodePreset = (presetCode: string) => {
  const [version, compressed] = presetCode.split(':')
  switch (version) {
    case '1': {
      return decodeV1(compressed)
    }
    default:
      break
  }
  return null
}
