import React from 'react'
import Grid from '@material-ui/core/Grid'
import Alert from '@material-ui/lab/Alert'
import AlertTitle from '@material-ui/lab/AlertTitle'

export interface ExamConflictsProps extends React.ComponentPropsWithoutRef<typeof Grid> {
  midterm: string[]
  final: string[]
}

const ExamConflicts = ({
  midterm,
  final,
  ...props
}: ExamConflictsProps) => {
  const hasMidtermConflict = midterm.length > 0
  const hasFinalConflict = final.length > 0

  if (!hasMidtermConflict && !hasFinalConflict) {
    return null
  }

  const halfWidth = hasMidtermConflict && hasFinalConflict

  return (
    <Grid container spacing={1} {...props}>
      <Grid item xs={12} sm={halfWidth ? 6 : 12}>
        {hasMidtermConflict && (
        <Alert severity="warning">
          <AlertTitle>Midterm Exam Conflict</AlertTitle>
          {midterm.join(', ')}
        </Alert>
        )}
      </Grid>
      <Grid item xs={12} sm={halfWidth ? 6 : 12}>
        {hasFinalConflict && (
        <Alert severity="warning">
          <AlertTitle>Final Exam Conflict</AlertTitle>
          {final.join(', ')}
        </Alert>
        )}
      </Grid>
    </Grid>
  )
}

export default ExamConflicts
