import React from 'react'
import Grid from '@material-ui/core/Grid'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import Skeleton from '@material-ui/lab/Skeleton'

import { Course, RegTime } from '../../models'
import * as utils from '../../utils'

const examTimeToString = (t: RegTime) => {
  if (!utils.isRegTimeDeclared(t)) {
    return t.status
  }
  const { start, end } = t
  return `${utils.toDateString(start)} ${utils.toTimeString(start)}-${utils.toTimeString(end)}`
}

interface FlexGridProps extends React.ComponentPropsWithoutRef<typeof Grid> {
  col1?: string
  col2?: string
  loading?: boolean
}

const FlexGrid = ({
  col1,
  col2,
  loading,
  ...props
}: FlexGridProps) => {
  const renderText = (text?: string) => (
    <>
      <Typography>{text}</Typography>
      <Divider />
    </>
  )

  return (
    <Grid container spacing={1} {...props}>
      <Grid item xs={12} sm={6} lg={12}>
        {loading ? <Skeleton /> : renderText(col1)}
      </Grid>
      <Grid item xs={12} sm={6} lg={12}>
        {loading ? <Skeleton /> : renderText(col2)}
      </Grid>
    </Grid>
  )
}

export interface CourseDescriptionProps extends React.ComponentPropsWithoutRef<typeof Grid> {
  data?: Course
}

const CourseDescription = ({
  data,
  ...props
}: CourseDescriptionProps) => {
  if (!data) {
    return (
      <Grid container spacing={1} {...props}>
        <FlexGrid item col1="-" col2="-" />
        <FlexGrid item col1="Credit: -" col2="Requirement: -" />
        <FlexGrid item col1="Midterm: -" col2="Final: -" />
      </Grid>
    )
  }

  const {
    name,
    faculty,
    totalCredit,
    creditDetail,
    requirement,
    exam,
  } = data

  return (
    <Grid container spacing={1} {...props}>
      <FlexGrid item col1={`${name.th} (${name.en})`} col2={faculty} />
      <FlexGrid item col1={`Credit: ${totalCredit} (${creditDetail})`} col2={`Requirement: ${requirement}`} />
      <FlexGrid item col1={`Midterm: ${examTimeToString(exam.midterm)}`} col2={`Final: ${examTimeToString(exam.final)}`} />
    </Grid>
  )
}

export const CourseDescriptionSkeleton = (props: React.ComponentPropsWithoutRef<typeof Grid>) => (
  <Grid container spacing={1} {...props}>
    <FlexGrid item loading />
    <FlexGrid item loading />
    <FlexGrid item loading />
  </Grid>
)

export default CourseDescription
