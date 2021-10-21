import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Alert from '@material-ui/lab/Alert'

import { Exam, AppState } from '../../models'
import { toDateString, toTimeString, dateDiff } from '../../utils'
import { selectCoursesWithData, selectCourseColor } from '../../selectors'
import Timetable, {
  EventRow,
  ColoredEventCell,
  ColoredEvent,
  TextRow,
} from '../../components/Timetable'
import { groupExamByDate, UnDeclaredExamGroup } from './groupby'

export interface ExamEvent extends ColoredEvent {
  metadata: {
    code: string
  }
}

const useStyles = makeStyles((theme) => ({
  noData: {
    margin: theme.spacing(0, 0, 1),
  },
  examBreak: {
    ...theme.typography.body1,
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

export interface SubTableProps {
  appState: AppState
  examType: keyof Exam
  onViewCourse: (code: string) => void
}

const SubTable = ({
  appState,
  examType,
  onViewCourse,
}: SubTableProps) => {
  const allCourses = selectCoursesWithData(appState)
  const groups = groupExamByDate(allCourses, examType)

  let tableStartHour = 8
  let tableEndHour = 16

  const [declared, undeclared] = groups
    .reduce(([dec, undec], group) => {
      if (group.declared) {
        const { courses } = group
        const events: ExamEvent[] = []
        dec.push(events)

        courses.forEach(({ code, time }) => {
          const { start, end } = time

          tableStartHour = Math.min(tableStartHour, start.getHours())
          tableEndHour = Math.max(tableEndHour, Math.ceil(end.getHours() + end.getMinutes() / 60))

          events.push({
            id: code,
            start,
            end,
            color: selectCourseColor(appState.preset, code),
            text: allCourses[code].shortname,
            subText: `${toTimeString(start)} - ${toTimeString(end)}`,
            metadata: {
              code,
            },
          })
        })
      } else {
        undec.push(group)
      }
      return [dec, undec]
    }, [
      [] as ExamEvent[][],
      [] as UnDeclaredExamGroup[],
    ] as const)

  const handleEventClick = (event: ExamEvent) => {
    const { code } = event.metadata
    onViewCourse(code)
  }

  const classes = useStyles()

  let children: JSX.Element | null = null

  if (declared.length !== 0) {
    let lastDate: Date | undefined
    children = (
      <div className={classes.tableContainer}>
        <Timetable
          startHour={tableStartHour}
          endHour={tableEndHour}
          rowHeaderWidth="120px"
        >
          {declared.map((events) => {
            const date = events[0].start
            const dateStr = toDateString(date)
            const diff = lastDate ? dateDiff(lastDate, date) : 0
            lastDate = date

            return (
              <React.Fragment key={dateStr}>
                {diff > 1 && (
                <TextRow
                  contentProps={{
                    className: classes.examBreak,
                  }}
                >
                  <i>{`break ${diff - 1} day${diff > 2 ? 's' : ''}`}</i>
                </TextRow>
                )}
                <EventRow
                  header={dateStr}
                  events={events}
                  cellComponent={ColoredEventCell}
                  onEventClick={handleEventClick}
                />
              </React.Fragment>
            )
          })}
        </Timetable>
      </div>
    )
  } else if (undeclared.length === 0) {
    children = (
      <Alert
        severity="info"
        className={classes.noData}
      >
        No data
      </Alert>
    )
  }

  return (
    <>
      {children}
      {undeclared
        .map(({ status, codes }) => codes
          .map((code) => (
            <Alert
              key={code}
              severity="info"
              className={classes.courseAlert}
            >
              <b>{allCourses[code].shortname}</b>
              {` - ${status}`}
            </Alert>
          )))
        .flat()}
    </>
  )
}

export default SubTable
