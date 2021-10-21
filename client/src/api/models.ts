import {
  Course,
  Section,
  Timetable,
} from '../models'

export interface RawRegTime {
  start: string | null
  end: string | null
  status: string
}

export interface RawTimetable extends Omit<Timetable, 'time'> {
  time: RawRegTime
}

export interface RawSection extends Omit<Section, 'timetables'> {
  timetables: RawTimetable[]
}

export interface RawExam {
  midterm: RawRegTime
  final: RawRegTime
}

export interface RawCourse extends Omit<
  Course, 'exam' | 'sections'
> {
  exam: RawExam
  sections: Record<string, RawSection>
}

export interface ServerSuccessResp<T> {
  data: T
  timestamp: string
}

export interface ServerErrorResp {
  type: string
  message: string
}
