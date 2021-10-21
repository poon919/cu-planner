import React from 'react'
import clsx from 'clsx'
import { makeStyles, fade } from '@material-ui/core/styles'
import Typography, { TypographyProps } from '@material-ui/core/Typography'

import { EventCell, TableEvent, EventCellProps } from './EventRow'

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    userSelect: 'none',
    '&:hover': {
      boxShadow: theme.shadows[5],
    },
    '& p': {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  },
  textContainer: {
    flex: '1 0 auto',
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 0.5),
  },
  subTextContainer: {
    padding: theme.spacing(0, 0.5),
    backgroundColor: fade(theme.palette.common.white, 0.20),
  },
}))

export interface ColoredEvent extends TableEvent {
  color: string
  subText?: string
}

export interface ColorEventCellProps<T extends ColoredEvent> extends EventCellProps<T> {
  textTypographyProps?: TypographyProps<'p'>
  subTextTypographyProps?: TypographyProps<'p'>
}

const ColoredEventCell = <T extends ColoredEvent>({
  event,
  className,
  style,
  textTypographyProps,
  subTextTypographyProps,
  ...props
}: ColorEventCellProps<T>) => {
  const {
    color,
    text,
    subText,
  } = event

  const classes = useStyles()

  return (
    <EventCell
      event={event}
      className={clsx(classes.root, className)}
      style={{
        backgroundColor: color,
        ...style,
      }}
      {...props}
    >
      <div className={classes.textContainer}>
        <Typography
          component="p"
          variant="body2"
          {...textTypographyProps}
        >
          {text}
        </Typography>
      </div>
      <div className={classes.subTextContainer}>
        <Typography
          component="p"
          variant="caption"
          color="textSecondary"
          {...subTextTypographyProps}
        >
          {subText}
        </Typography>
      </div>
    </EventCell>
  )
}

export default ColoredEventCell
