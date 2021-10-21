export type FetchingState = { type: 'fetching' }
export type FetchSuccessState<T> = { type: 'success', data: T, timestamp: Date }
export type FetchErrorState = { type: 'error', message: string }
export type FetchState<T> = FetchingState | FetchSuccessState<T> | FetchErrorState

export type CourseFetchState = FetchState<Course>
export type CourseListFetchState = FetchState<CourseInfo[]>
export type ValidSemestersFetchState = FetchState<string[]>

export interface AppState {
  preset: Preset
  courseData: Record<string, CourseFetchState | undefined>
}

export type Program = 'S' | 'T' | 'I'
export type Semester = '1' | '2' | '3'

export interface CourseFilter {
  section: string
  keyword: string
}

export interface Preset {
  readonly id: number
  name: string
  program: Program
  acadyear: number
  semester: Semester
  courses: string[]
  filters: Record<string, CourseFilter | undefined>
}

export type PresetInfo = Pick<Preset, 'id' | 'name' | 'program' | 'semester' | 'acadyear'>

export interface UndecalredRegTime {
  start: null
  end: null
  status: Exclude<string, ''>
}

export interface DeclaredRegTime {
  start: Date
  end: Date
  status: ''
}

export type RegTime = UndecalredRegTime | DeclaredRegTime

export type DeclaredDay = 'SU' | 'MO' | 'TU' | 'WE' | 'TH' | 'FR' | 'SA'

export interface Timetable {
  method: string
  days: string[]
  time: RegTime
  building: string
  room: string
  instructor: string
  note: string
}

export interface Section {
  isOpen: boolean
  no: string
  registered: number
  maxRegister: number
  timetables: Timetable[]
}

export interface Exam {
  midterm: RegTime
  final: RegTime
}

export interface Course {
  code: string
  shortname: string
  name: Record<string, string>

  faculty: string
  program: Program
  acadyear: number
  semester: Semester

  totalCredit: number
  creditDetail: string
  hourDetail: string

  requirement: string

  exam: Exam

  sections: Record<string, Section>
}

export type CourseInfo = Pick<Course, 'code' | 'shortname'>
