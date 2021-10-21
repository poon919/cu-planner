import { DeclaredDay, RegTime, DeclaredRegTime } from '../models'

export const MILLISEC_IN_DAY = 24 * 60 * 60 * 1000
export const MONTH_NUM2EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DECLARED_DAY = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU']

export const currentAcadyear = new Date().getMonth() < 5
  ? new Date().getFullYear() - 1
  : new Date().getFullYear()

export const toDateString = (d: Date | null) => (d === null ? '' : `${d.getDate().toString()} ${MONTH_NUM2EN[d.getMonth()]} ${d.getFullYear()}`)
export const toTimeString = (d: Date | null) => (d === null ? '' : `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`)
export const getDate = (d: Date) => Math.floor(d.getTime() / MILLISEC_IN_DAY)
export const dateDiff = (d1: Date, d2: Date) => getDate(d2) - getDate(d1)
export const isTimetableDayDelcared = (d: string): d is DeclaredDay => DECLARED_DAY.indexOf(d) >= 0
export const isRegTimeDeclared = (rt: RegTime): rt is DeclaredRegTime => rt.status === ''

export const isRegTimeEqual = (rt1: RegTime, rt2: RegTime) => (
  isRegTimeDeclared(rt1)
  && isRegTimeDeclared(rt2)
  && rt1.start.getTime() === rt2.start.getTime()
  && rt1.end.getTime() === rt2.end.getTime()
)

export const isRegTimeSameDate = (rt1: RegTime, rt2: RegTime) => (
  isRegTimeDeclared(rt1)
  && isRegTimeDeclared(rt2)
  && getDate(rt1.start) === getDate(rt2.start)
  && getDate(rt1.end) === getDate(rt2.end)
)

export const isRegTimeOverlap = (rt1: RegTime, rt2: RegTime) => (
  isRegTimeDeclared(rt1)
  && isRegTimeDeclared(rt2)
  && rt1.end.getTime() > rt2.start.getTime()
  && rt2.end.getTime() > rt1.start.getTime()
)
