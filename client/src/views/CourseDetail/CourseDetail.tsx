import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import TableContainer from '@material-ui/core/TableContainer'
import Skeleton from '@material-ui/lab/Skeleton'

import * as sels from '../../selectors'
import * as utils from '../../utils'
import { Course } from '../../models'
import CourseFilterForm, { useForm } from '../../components/forms/CourseFilterForm'
import LargeAlert from '../../components/LargeAlert'
import SectionTable from '../../components/SectionTable'
import CourseTitle from './Title'
import CourseDescription, { CourseDescriptionSkeleton } from './Description'
import ExamConflicts from './Conflicts'
import { CourseDetailProps } from './interfaces'

const findExamConflicts = (course: Course, allCourses: Record<string, Course>) => Object
  .values(allCourses)
  .reduce((acc, data) => {
    const { code, exam } = data
    if (course.code === code) {
      return acc
    }
    if (utils.isRegTimeOverlap(course.exam.midterm, exam.midterm)) {
      acc[0].push(data.shortname)
    }
    if (utils.isRegTimeOverlap(course.exam.final, exam.final)) {
      acc[1].push(data.shortname)
    }
    return acc
  }, [[], []] as [string[], string[]])

const useStyles = makeStyles((theme) => ({
  details: {
    '& p': {
      height: '100%',
    },
  },
  alertContainer: {
    '& > div': {
      width: '100%',
    },
  },
  tableSkeleton: {
    width: '100%',
    height: '100px',
    margin: theme.spacing(1, 0.5),
  },
  filterContainer: {
    [`@media (min-height: ${theme.breakpoints.values.sm}px)`]: {
      position: 'sticky',
      top: '0px',
      left: '0px',
      zIndex: 2,
      backgroundColor: theme.palette.background.default,
    },
  },
  tableContainer: {
    padding: `${theme.spacing(0, 0.5, 0.5, 0)} !important`,
    margin: theme.spacing(0.5, 0, 0, 0.5),
  },
}))

export const CourseDetail = ({
  code,
  appState,
  onFilterChange,
  onAddCourse,
  onDeleteCourse,
  ...props
}: CourseDetailProps) => {
  const [localFilter, setLocalFilter] = useState({ section: '', keyword: '' })

  const result = appState?.courseData[code]
  const shortname = result?.type === 'success' ? result.data.shortname : ''
  const color = sels.selectCourseColor(appState?.preset, code)
  const added = !!appState && appState.preset.courses.indexOf(code) >= 0
  const filter = added && appState
    ? sels.selectCourseFilter(code, appState.preset.filters)
    : localFilter

  const { form } = useForm({
    values: filter,
    onChange: (e, values) => {
      const { name, value } = e.target
      const nextValues = { ...values, [name]: value }
      if (filter === localFilter) {
        setLocalFilter(nextValues)
        return
      }
      onFilterChange?.(code, nextValues)
    },
  })

  const handleAddCourse = () => onAddCourse(code, filter)

  const handleDeleteCourse = () => {
    setLocalFilter(filter)
    onDeleteCourse(code)
  }

  const classes = useStyles()

  let children: JSX.Element | null = null

  if (!appState || !result) {
    children = (
      <>
        <CourseDescription item className={classes.details} />
        <Grid item container spacing={1} className={classes.filterContainer}>
          <Grid item xs>
            <CourseFilterForm.SectionField form={form} disabled />
          </Grid>
          <Grid item xs>
            <CourseFilterForm.KeywordField form={form} disabled />
          </Grid>
        </Grid>
        <TableContainer component={Grid} item className={classes.tableContainer}>
          <SectionTable sections={[]} />
        </TableContainer>
      </>
    )
  } else if (result?.type === 'fetching') {
    children = (
      <>
        <CourseDescriptionSkeleton item container spacing={1} className={classes.details} />
        <Skeleton component={Grid} item variant="rect" className={classes.tableSkeleton} />
      </>
    )
  } else if (result?.type === 'error') {
    children = (
      <Grid item container className={classes.alertContainer}>
        <LargeAlert
          severity="error"
          title={result.message}
          height={220}
          borderless
        />
      </Grid>
    )
  } else if (result?.type === 'success') {
    const { data } = result
    const [midCf, finalCf] = findExamConflicts(data, sels.selectCoursesWithData(appState))

    children = (
      <>
        <CourseDescription item data={data} className={classes.details} />
        <ExamConflicts item midterm={midCf} final={finalCf} className={classes.alertContainer} />
        <Grid item container spacing={1} className={classes.filterContainer}>
          <Grid item xs>
            <CourseFilterForm.SectionField form={form} />
          </Grid>
          <Grid item xs>
            <CourseFilterForm.KeywordField form={form} />
          </Grid>
        </Grid>
        <TableContainer component={Grid} item className={classes.tableContainer}>
          <SectionTable sections={sels.selectFilteredSections(data, filter)} />
        </TableContainer>
      </>
    )
  }

  return (
    <Grid
      container
      spacing={1}
      {...props}
    >
      <CourseTitle
        item
        code={code || '0000000'}
        shortname={shortname}
        color={color}
        added={added}
        disabled={!code || !appState}
        onAddCourse={handleAddCourse}
        onDeleteCourse={handleDeleteCourse}
      />
      {children}
    </Grid>
  )
}

export default CourseDetail
