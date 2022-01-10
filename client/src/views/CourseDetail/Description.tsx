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

interface RowProps extends React.ComponentPropsWithoutRef<typeof Grid> {
  loading?: boolean
}

const Row = ({
  loading,
  children,
  ...props
}: RowProps) => (
  <Grid item {...props}>
    {loading
      ? <Skeleton />
      : (
        <>
          <Typography>{children}</Typography>
          <Divider />
        </>
      )}
  </Grid>
)

export interface CourseDescriptionProps extends React.ComponentPropsWithoutRef<typeof Grid> {
  data?: Course
  loading?: boolean
}

const CourseDescription = ({
  data,
  loading,
  ...props
}: CourseDescriptionProps) => {
  let children: React.ReactNode = null

  if (loading) {
    children = (
      <>
        <Row item loading />
        <Row item loading />
        <Row item loading />
        <Row item loading />
        <Row item loading />
        <Row item loading />
      </>
    )
  } else if (!data) {
    children = (
      <>
        <Row>-</Row>
        <Row>-</Row>
        <Row>Credit: -</Row>
        <Row>Requirement: -</Row>
        <Row>Midterm: -</Row>
        <Row>Final: -</Row>
      </>
    )
  } else {
    const {
      name,
      faculty,
      totalCredit,
      creditDetail,
      requirement,
      exam,
    } = data

    children = (
      <>
        <Row>{`${name.th} (${name.en})`}</Row>
        <Row>{faculty}</Row>
        <Row>{`Credit: ${totalCredit} (${creditDetail})`}</Row>
        <Row>{`Requirement: ${requirement}`}</Row>
        <Row>{`Midterm: ${examTimeToString(exam.midterm)}`}</Row>
        <Row>{`Final: ${examTimeToString(exam.final)}`}</Row>
      </>
    )
  }

  return (
    <Grid container direction="column" wrap="nowrap" spacing={1} {...props}>
      {children}
    </Grid>
  )
}

export default CourseDescription
