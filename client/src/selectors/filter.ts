import { createSelector } from 'reselect'

import {
  CourseFilter,
  Course,
  Section,
  Timetable,
} from '../models'
import { DEFAULT_FILTER } from '../const'
import { splitFilter, parseSectionFilter } from '../utils/filter'
import { createSelectorMappingMemo } from './creator'

/**
 * Return sorted filtered sections.
 *
 * - 1 => match section 1 only
 * - 1-9 => match section 1 to 9
 * */
const filterBySecNum = (sections: Record<string, Section>, sectionFilter: string) => {
  const max = Math.max(...Object.keys(sections).map((no) => Number(no)))
  if (sectionFilter.trim() === '') {
    return Object
      .values(sections)
      .sort((a, b) => +a.no - +b.no)
  }
  return parseSectionFilter(sectionFilter).reduce((acc, span) => {
    const start = span[0]
    const end = span[1]
    for (let i = start; i <= end && i <= max; i++) {
      acc.push(sections[i])
    }
    return acc
  }, [] as Section[])
}

const SEARCH_FIELDS: (keyof Timetable)[] = ['method', 'days', 'building', 'room', 'instructor', 'note']

const filterByKeyword = (sections: Section[], keywordFilter: string) => {
  if (keywordFilter.trim() === '') {
    return sections
  }
  const filters = splitFilter(keywordFilter)
  return sections.filter(
    (section) => section.timetables.some(
      (tt) => filters.some(
        (filter) => SEARCH_FIELDS.some(
          (field) => (tt[field] as string | string[]).indexOf(filter) >= 0,
        ),
      ),
    ),
  )
}

const filterSections = (sections: Record<string, Section>, filter: CourseFilter) => {
  const filtered = filterBySecNum(sections, filter.section)
  return filterByKeyword(filtered, filter.keyword)
}

const selectFilteredSectionsBase = createSelectorMappingMemo(() => createSelector(
  (course: Course) => course.sections,
  (_: Course, filters: CourseFilter) => filters.section,
  (_: Course, filters: CourseFilter) => filters.keyword,
  (sections, sectionFilter, keywordFilter) => filterSections(
    sections,
    {
      section: sectionFilter,
      keyword: keywordFilter,
    },
  ),
), 10)

export const selectFilteredSections = (course: Course, filters: CourseFilter) => (
  selectFilteredSectionsBase(course.code, course, filters)
)

export const selectCourseFilter = (
  code: string, filters: Record<string, CourseFilter | undefined>,
) => filters[code] || DEFAULT_FILTER
