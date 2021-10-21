import { AxiosResponse } from 'axios'

import {
  FetchingState,
  CourseListFetchState,
  CourseFetchState,
  ValidSemestersFetchState,
  PresetInfo,
  CourseInfo,
} from '../models'
import {
  RawCourse,
  ServerSuccessResp,
} from './models'
import { mergeSortedCourses } from './utils'
import { parseRawCourse } from './parser'
import { getData } from './client'

type AxiosSuccessResp<T> = AxiosResponse<ServerSuccessResp<T>>

const NOCACHE_HEADERS = {
  'Cache-Control': 'no-cache',
  Pragma: 'no-cache',
  Expires: '0',
}

export const fetchValidSemesters = async (): Promise<ValidSemestersFetchState> => {
  const url = '/semesters'
  const resp = await getData<string[]>(url)

  return resp
}

export const fetchCourseList = async (
  preset: PresetInfo,
  code: string,
  shortname: string,
): Promise<Exclude<CourseListFetchState, FetchingState>> => {
  const { program, acadyear, semester } = preset

  const params = { code, shortname }
  const semCode = `${program}${acadyear}${semester}`
  const url = `/semesters/${encodeURIComponent(semCode)}/courses`
  const resp = await getData<CourseInfo[]>(url, { params })

  return resp
}

export const fetchMultiCourseLists = async (
  preset: PresetInfo,
  queries: Array<{ code: string, shortname: string }>,
): Promise<Exclude<CourseListFetchState, FetchingState>> => Promise
  .all(queries.map(async ({ code, shortname }) => {
    const resp = await fetchCourseList(preset, code, shortname)

    if (resp.type === 'error') {
      return Promise.reject(resp)
    }
    return resp
  }))
  .then(
    (resps) => ({
      type: 'success',
      data: mergeSortedCourses(resps.map((resp) => resp.data)),
    }),
    (errResp) => errResp,
  )

export const fetchCourse = async (
  preset: PresetInfo,
  code: string,
  renew: boolean,
): Promise<Exclude<CourseFetchState, FetchingState>> => {
  const { program, acadyear, semester } = preset
  const semCode = `${program}${acadyear}${semester}`
  const url = `/semesters/${encodeURIComponent(semCode)}/courses/${encodeURIComponent(code)}`
  const headers = renew ? NOCACHE_HEADERS : {}
  const resp = await getData<RawCourse>(url, { headers })

  if (resp.type === 'success') {
    const { data } = resp
    return {
      ...resp,
      data: parseRawCourse(data),
    }
  }
  return resp
}
