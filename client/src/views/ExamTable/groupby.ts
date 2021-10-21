import { createSelector } from 'reselect'

import {
  Course,
  DeclaredRegTime,
  RegTime,
  Exam,
} from '../../models'
import { isRegTimeSameDate, isRegTimeDeclared, dateDiff } from '../../utils'

export interface DeclaredExamGroup {
  declared: true
  date: DeclaredRegTime
  courses: Array<{
    code: string
    time: DeclaredRegTime
  }>
}

export interface UnDeclaredExamGroup {
  declared: false
  status: string
  codes: string[]
}

export type ExamGroup = DeclaredExamGroup | UnDeclaredExamGroup

const findGroup = (groups: ExamGroup[], date: RegTime) => {
  let match: ExamGroup | undefined
  if (isRegTimeDeclared(date)) {
    match = groups.find((group) => group.declared && isRegTimeSameDate(group.date, date))

    if (!match) {
      match = {
        declared: true,
        date,
        courses: [],
      }
      groups.push(match)
    }
  } else {
    match = groups.find((group) => !group.declared && group.status === date.status)

    if (!match) {
      match = {
        declared: false,
        status: date.status,
        codes: [],
      }
      groups.push(match)
    }
  }
  return match
}

const sortByDate = (a: ExamGroup, b: ExamGroup) => {
  if (!a.declared) {
    return 1
  }
  if (!b.declared) {
    return -1
  }
  return dateDiff(b.date.start, a.date.start)
}

export const groupExamByDate = createSelector(
  (courses: Record<string, Course>) => courses,
  (_: any, examType: keyof Exam) => examType,
  (courses, examType) => {
    const groups = Object
      .values(courses)
      .reduce((acc, course) => {
        const examTime = course.exam[examType]
        const group = findGroup(acc, examTime)
        if (group.declared) {
          group.courses.push({
            code: course.code,
            time: examTime as DeclaredRegTime,
          })
        } else {
          group.codes.push(course.code)
        }
        return acc
      }, [] as ExamGroup[])

    return groups.sort(sortByDate)
  },
)
