/** eslint-disable */
import { parseRawCourse } from '../api/parser'
import { RawCourse } from '../api/models'
import {
  PresetInfo,
  AppState,
  FetchSuccessState,
  Course,
} from '../models'

import * as Data2110101 from './data/2110101.json'
import * as Data2301107 from './data/2301107.json'
import * as Data2900111 from './data/2900111.json'
import * as Data5500111 from './data/5500111.json'
import * as Data2308354 from './data/2308354.json'

export const Courses = [
  parseRawCourse(Data5500111.data as RawCourse),
  parseRawCourse(Data2110101.data as RawCourse),
  parseRawCourse(Data2301107.data as RawCourse),
  parseRawCourse(Data2900111.data as RawCourse),
  parseRawCourse(Data2308354.data as RawCourse),
]

export const TestAppState: AppState = {
  preset: {
    id: 1,
    name: 'Preset A',
    program: 'S',
    acadyear: 2020,
    semester: '1',
    courses: [
      ...Courses.map(({ code }) => code),
      '0000100',
      '0000200',
      '0000300',
    ],
    filters: {
      [Courses[0].code]: { section: '1-150', keyword: '' },
    },
  },
  viewCourseCode: '',
  courseData: {
    ...Courses.reduce((acc, course) => {
      acc[course.code] = { type: 'success', data: course, timestamp: new Date() }
      return acc
    }, {} as Record<string, FetchSuccessState<Course>>),
    '0000100': { type: 'fetching' },
    '0000200': { type: 'error', message: 'Some error message' },
  },
}

export const EmptyAppState: AppState = {
  preset: {
    id: 1,
    name: 'Preset A',
    program: 'S',
    acadyear: 2020,
    semester: '1',
    courses: [],
    filters: {},
  },
  viewCourseCode: '',
  courseData: {},
}

export const TestPresets: PresetInfo[] = Array(26).fill(0).map((_, i) => ({
  id: i,
  name: String.fromCodePoint(65 + i) + String.fromCodePoint(65 + i).repeat(4).toLowerCase(),
  program: ['S', 'T', 'I'][i % 3] as PresetInfo['program'],
  acadyear: 2010 + i,
  semester: ['1', '2', '3'][i % 3] as PresetInfo['semester'],
}))
