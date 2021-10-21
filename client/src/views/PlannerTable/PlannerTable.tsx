import React, { useState, useEffect } from 'react'
import { makeStyles, Theme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import Alert from '@material-ui/lab/Alert'

import { CourseFilter } from '../../models'
import {
  selectCourseFilter,
  selectCoursesWithData,
  selectCourseColor,
} from '../../selectors'
import { parseSectionFilter, sectionSpansToText } from '../../utils'
import { usePrevious } from '../../hooks'
import Timetable, { EventRow } from '../../components/Timetable'
import EventCell, { SectionGroupEvent } from './EventCell'
import { SectionSpan, anySpanOverlap, isSpansEqual } from './utils'
import { groupSectionByTime, UnDeclaredSectionGroup } from './groupby'
import FilterBox from './FilterBox'
import { PlannerTableProps } from './interfaces'

interface Preview {
  code: string
  secSpans: SectionSpan[]
  filter: CourseFilter
}

const useStyles = makeStyles((theme) => ({
  filterContainer: {
    position: 'sticky',
    top: '0px',
    left: '0px',
    zIndex: 2,
    backgroundColor: theme.palette.background.default,
  },
  tableContainer: {
    overflowX: 'auto',
    overflowY: 'hidden',
    padding: theme.spacing(0, 0, 1),
  },
  courseAlert: {
    margin: theme.spacing(0, 0, 1),
  },
}))

export const PlannerTable = React.memo(({
  appState,
  onViewCourse,
  onFilterChange,
}: PlannerTableProps) => {
  const [selected, setSelected] = useState('')
  const [preview, setPreview] = useState<Preview | null>(null)
  const prevSelected = usePrevious(selected)
  const isLgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'))
  const activeFilter = selectCourseFilter(selected, appState.preset.filters)
  const allCourses = selectCoursesWithData(appState)

  let tableStartHour = 8
  let tableEndHour = 16

  const [declared, undeclared] = Object
    .values(allCourses)
    .reduce(([dec, undec], course) => {
      const filter = selectCourseFilter(course.code, appState.preset.filters)
      groupSectionByTime(course, filter)
        .forEach((group) => {
          if (group.declared) {
            const {
              code,
              day,
              time,
              secSpans,
            } = group
            const { start, end } = time
            if (dec[day] === undefined) {
              dec[day] = []
            }

            tableStartHour = Math.min(tableStartHour, start.getHours())
            tableEndHour = Math.max(tableEndHour, end.getHours() + Math.ceil(end.getMinutes() / 60))

            const id = `${code}-${day}-${start.getTime()}-${end.getTime()}`
            const sectionText = sectionSpansToText(secSpans)
            const isFiltered = !!preview
              && preview.code === code
              && !anySpanOverlap(preview.secSpans, secSpans)
            dec[day].push({
              id,
              start,
              end,
              text: allCourses[code].shortname,
              subText: sectionText,
              color: selectCourseColor(appState.preset, code),
              isFiltered,
              metadata: {
                code,
                sectionFilter: sectionText,
                secSpans,
              },
            })
          } else {
            undec.push(group)
          }
        })
      return [dec, undec]
    }, [
      {} as Record<string, SectionGroupEvent[]>,
      [] as UnDeclaredSectionGroup[],
    ] as const)

  useEffect(() => {
    if (!allCourses[selected]) {
      setSelected('')
      setPreview(null)
    }
  }, [allCourses, selected])

  useEffect(() => {
    if (prevSelected === selected) {
      setPreview(null)
    }
  }, [activeFilter])

  const handleApplyPreview = () => {
    onFilterChange(selected, preview!.filter)
  }

  const handleEventClick = (event: SectionGroupEvent) => {
    const { code, sectionFilter, secSpans } = event.metadata

    setSelected(code)
    if (isLgUp) {
      onViewCourse(code)
    }

    const filter = selectCourseFilter(code, appState.preset.filters)
    if (isSpansEqual(secSpans, parseSectionFilter(filter.section))) {
      setPreview(null)
    } else {
      setPreview({
        code,
        secSpans,
        filter: { ...filter, section: sectionFilter },
      })
    }
  }

  const handleEventDoubleClick = (event: SectionGroupEvent) => {
    const { code, sectionFilter } = event.metadata
    onFilterChange(code, { ...activeFilter, section: sectionFilter })
  }

  const classes = useStyles()

  return (
    <div>
      <div className={classes.filterContainer}>
        <FilterBox
          selected={selected}
          filter={activeFilter}
          preview={preview?.filter}
          onSelectCourse={setSelected}
          onFilterChange={onFilterChange}
          onApplyPreview={handleApplyPreview}
          onRejectPreview={() => setPreview(null)}
          onViewCourse={onViewCourse}
          items={Object
            .keys(allCourses)
            .map((code) => ({
              key: code,
              value: code,
              text: allCourses[code].shortname,
            }))}
        />
      </div>
      <div className={classes.tableContainer}>
        <Timetable
          startHour={tableStartHour}
          endHour={tableEndHour}
          rowHeaderWidth="50px"
          onClick={() => setPreview(null)}
        >
          {['MO', 'TU', 'WE', 'TH', 'FR'].map((day) => (
            <EventRow
              key={day}
              header={day}
              events={declared[day] || []}
              cellComponent={EventCell}
              onEventClick={handleEventClick}
              onEventDoubleClick={handleEventDoubleClick}
            />
          ))}
          {(declared.SA || declared.SU) && ['SA', 'SU'].map((day) => (
            <EventRow
              key={day}
              header={day}
              events={declared[day] || []}
              cellComponent={EventCell}
              onEventClick={handleEventClick}
              onEventDoubleClick={handleEventDoubleClick}
            />
          ))}
        </Timetable>
      </div>
      {undeclared.map(({ code, status, secSpans }) => (
        <Alert
          key={`${status}-${code}`}
          severity="info"
          className={classes.courseAlert}
        >
          <b>{allCourses[code].shortname}</b>
          {` (${sectionSpansToText(secSpans)}) - ${status}`}
        </Alert>
      ))}
    </div>
  )
})

export default PlannerTable
