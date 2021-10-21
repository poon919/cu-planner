import React from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import AddIcon from '@material-ui/icons/Add'
import CheckIcon from '@material-ui/icons/Check'

const useStyles = makeStyles((theme) => ({
  title: {
    flex: '1 1 auto',
  },
  actionButton: {
    padding: '0px',
    margin: theme.spacing(0.5, 0, 0),
    color: theme.palette.primary.main,
  },
  added: {
    color: theme.palette.success.main,
  },
  colorBox: {
    width: theme.spacing(2),
    margin: theme.spacing(0, 1, 0, 0),
  },
}))

export interface CourseTitleProps extends React.ComponentPropsWithoutRef<typeof Grid> {
  code: string
  shortname: string
  color: string
  added?: boolean
  onAddCourse: () => void
  onDeleteCourse: () => void
  disabled?: boolean
}

const CourseTitle = ({
  code,
  shortname,
  color,
  added,
  disabled,
  onAddCourse,
  onDeleteCourse,
  ...props
}: CourseTitleProps) => {
  const handler = added ? onDeleteCourse : onAddCourse

  const classes = useStyles()

  return (
    <Grid container wrap="nowrap" {...props}>
      <div className={classes.colorBox} style={{ backgroundColor: color }} />
      <div className={classes.title}>
        <Typography color="textSecondary">{code}</Typography>
        <Typography variant="h6"><b>{shortname}</b></Typography>
        <Button
          variant="text"
          startIcon={added ? <CheckIcon /> : <AddIcon />}
          onClick={handler}
          disabled={disabled}
          className={clsx(
            classes.actionButton,
            { [classes.added]: added },
          )}
        >
          {added ? 'Added' : 'Add to preset'}
        </Button>
      </div>
    </Grid>
  )
}

export default CourseTitle
