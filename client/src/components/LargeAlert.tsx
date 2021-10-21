import React from 'react'
import clsx from 'clsx'
import { makeStyles, darken } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import CheckCircleOutlinedIcon from '@material-ui/icons/CheckCircleOutlined'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined'
import ReportProblemOutlinedIcon from '@material-ui/icons/ReportProblemOutlined'
import ErrorOutlineOutlinedIcon from '@material-ui/icons/ErrorOutlineOutlined'

const iconMap = {
  none: InfoOutlinedIcon,
  success: CheckCircleOutlinedIcon,
  info: InfoOutlinedIcon,
  warning: ReportProblemOutlinedIcon,
  error: ErrorOutlineOutlinedIcon,
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.shape.borderRadius,
  },
  bordered: {
    padding: theme.spacing(1),
    borderWidth: 1,
    borderStyle: 'solid',
  },
  icon: {
    fontSize: 70,
  },
  description: {},
  none: {
    color: theme.palette.text.primary,
    borderColor: theme.palette.grey[600],
    '& $icon': {
      color: theme.palette.action.active,
    },
    '& $description': {
      color: theme.palette.text.secondary,
    },
  },
  success: {
    color: darken(theme.palette.success.main, 0.6),
    borderColor: theme.palette.success.main,
    '& $icon': {
      color: theme.palette.success.main,
    },
    '& $description': {
      color: darken(theme.palette.success.main, 0.5),
    },
  },
  info: {
    color: darken(theme.palette.info.main, 0.6),
    borderColor: theme.palette.info.main,
    '& $icon': {
      color: theme.palette.info.main,
    },
    '& $description': {
      color: darken(theme.palette.info.main, 0.5),
    },
  },
  warning: {
    color: darken(theme.palette.warning.main, 0.6),
    borderColor: theme.palette.warning.main,
    '& $icon': {
      color: theme.palette.warning.main,
    },
    '& $description': {
      color: darken(theme.palette.warning.main, 0.5),
    },
  },
  error: {
    color: darken(theme.palette.error.main, 0.6),
    borderColor: theme.palette.error.main,
    '& $icon': {
      color: theme.palette.error.main,
    },
    '& $description': {
      color: darken(theme.palette.error.main, 0.55),
    },
  },
}))

export interface LargeAlertProps extends React.ComponentPropsWithoutRef<typeof Paper> {
  severity: 'none' | 'success' | 'info' | 'warning' | 'error'
  icon?: React.ComponentType<{ className: string }>
  title?: string
  borderless?: boolean
  width?: string | number
  height?: string | number
}

const LargeAlert = ({
  severity,
  icon,
  title,
  borderless,
  width,
  height,
  className,
  style,
  children,
  ...props
}: LargeAlertProps) => {
  const Icon = icon || iconMap[severity]

  const classes = useStyles()

  return (
    <Paper
      elevation={0}
      className={clsx(
        classes.root,
        classes[severity],
        { [classes.bordered]: !borderless },
        className,
      )}
      style={{
        width,
        height,
        ...style,
      }}
      {...props}
    >
      <div>
        <Icon className={classes.icon} />
      </div>
      <Typography variant="h6">{title}</Typography>
      <Typography className={classes.description}>{children}</Typography>
    </Paper>
  )
}

LargeAlert.defaultProps = {
  severity: 'none',
  height: 170,
}

export default LargeAlert
