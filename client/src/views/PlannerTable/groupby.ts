import { createSelector } from 'reselect'

import {
  CourseFilter,
  Course,
  DeclaredDay,
  DeclaredRegTime,
  RegTime,
  Timetable,
} from '../../models'
import {
  SectionSpan,
  isTimetableDayDelcared,
  isRegTimeEqual,
  isRegTimeDeclared,
  isRegTimeOverlap,
} from '../../utils'
import { createSelectorMappingMemo, selectFilteredSections } from '../../selectors'

const isRegTimeContinuous = (rt1: DeclaredRegTime, rt2: DeclaredRegTime) => (
  isRegTimeDeclared(rt1)
  && isRegTimeDeclared(rt2)
  && (rt1.end.getTime() === rt2.start.getTime() || rt2.end.getTime() === rt1.start.getTime())
)

const mergeTimetables = (tts: Timetable[]) => tts.reduce((acc, tt) => {
  for (let i = 0; i < acc.length; i++) {
    const target = acc[i]
    const t1 = target.time
    const t2 = tt.time
    if (
      isRegTimeDeclared(t1)
      && isRegTimeDeclared(t2)
      && (isRegTimeOverlap(t1, t2) || isRegTimeContinuous(t1, t2))
    ) {
      target.time = {
        start: t1.start < t2.start ? t1.start : t2.start,
        end: t1.end > t2.end ? t1.end : t2.end,
        status: '',
      }
      return acc
    }
  }
  acc.push({ ...tt })
  return acc
}, [] as Timetable[])

export interface DeclaredSectionGroup {
  declared: true
  code: string
  day: DeclaredDay
  time: DeclaredRegTime
  secSpans: SectionSpan[]
}

export interface UnDeclaredSectionGroup {
  declared: false
  code: string
  status: string
  secSpans: SectionSpan[]
}

export type SectionGroup = DeclaredSectionGroup | UnDeclaredSectionGroup

const findGroup = (groups: SectionGroup[], code: string, day: string, time: RegTime) => {
  let match: SectionGroup | undefined
  if (isTimetableDayDelcared(day) && isRegTimeDeclared(time)) {
    match = groups.find((group) => group.declared
      && group.code === code
      && group.day === day
      && isRegTimeEqual(group.time, time))

    if (!match) {
      match = {
        declared: true,
        code,
        day,
        time,
        secSpans: [],
      }
      groups.push(match)
    }
  } else {
    match = groups.find((group) => !group.declared
      && group.code === code
      && group.status === time.status)

    if (!match) {
      match = {
        declared: false,
        code,
        status: time.status,
        secSpans: [],
      }
      groups.push(match)
    }
  }
  return match
}

export const groupSectionByTime = createSelectorMappingMemo(
  () => createSelector(
    (course: Course) => course.code,
    (course: Course, filter: CourseFilter) => selectFilteredSections(course, filter),
    (code, sections) => sections
      .reduce((acc, sec) => {
        if (sec.isOpen) {
          const secNo = Number(sec.no)
          mergeTimetables(sec.timetables).forEach((tt) => {
            tt.days.forEach((day) => {
              const { secSpans } = findGroup(acc, code, day, tt.time)
              if (secSpans.length > 0) {
                const lastSecSpan = secSpans[secSpans.length - 1]
                if (lastSecSpan[1] + 1 === secNo) {
                  lastSecSpan[1] = secNo
                  return
                }
              }
              secSpans.push([secNo, secNo])
            })
          })
        }
        return acc
      }, [] as SectionGroup[]),
  ),
  (course) => course.code,
  10,
)
