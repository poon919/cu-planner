import { AxiosResponse } from 'axios'

import {
  Course,
  Exam,
  Section,
  Timetable,
  RegTime,
} from '../models'
import {
  RawCourse,
  RawRegTime,
  RawTimetable,
  RawExam,
  ServerErrorResp,
} from './models'

const parseRawTime = (rawTime: string) => {
  const res = rawTime
    .split(':')
    .map((s) => +s)
  return new Date(1, 1, 1, res[0], res[1])
}

const parseRawDate = (rawDate: string) => new Date(rawDate)

const parseRawRegTime = (rawRegTime: RawRegTime, timeParser: (t: string) => Date): RegTime => {
  const { start, end, status } = rawRegTime
  if (status !== '') {
    return {
      start: null,
      end: null,
      status,
    }
  }
  return {
    start: timeParser(start!),
    end: timeParser(end!),
    status,
  }
}

const parseRawExam = (rExam: RawExam): Exam => ({
  midterm: parseRawRegTime(rExam.midterm, parseRawDate),
  final: parseRawRegTime(rExam.final, parseRawDate),
})

const parseRawTimetables = (rtts: RawTimetable[]): Timetable[] => rtts
  .reduce((acc, rtt) => {
    const time = parseRawRegTime(rtt.time, parseRawTime)
    acc.push({
      ...rtt,
      time,
    })
    return acc
  }, [] as Timetable[])

export const parseRawCourse = (rCourse: RawCourse): Course => {
  const {
    exam: rExam,
    sections: rSections,
  } = rCourse

  const exam = parseRawExam(rExam)
  const sections = Object
    .entries(rSections)
    .reduce((acc, [no, rSec]) => {
      const timetables = parseRawTimetables(rSec.timetables)
      acc[no] = {
        ...rSec,
        timetables,
      }
      return acc
    }, {} as Record<string, Section>)

  return {
    ...rCourse,
    exam,
    sections,
  }
}

export const parseErrorMessage = (err: any) => {
  let message: string | undefined
  if (err.response) {
    const errResp: AxiosResponse<ServerErrorResp> = err.response
    message = errResp.data.message
  }
  message = message || err.message
  return message
    ? String(message)[0].toUpperCase() + String(message).slice(1)
    : 'Some error occurs'
}
