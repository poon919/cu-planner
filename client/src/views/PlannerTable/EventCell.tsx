import React from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'

import { ColoredEventCell, ColorEventCellProps, ColoredEvent } from '../../components/Timetable'
import { SectionSpan } from './utils'

export interface SectionGroupEvent extends ColoredEvent {
  isFiltered: boolean
  metadata: {
    code: string
    sectionFilter: string
    secSpans: SectionSpan[]
  }
}

const useStyles = makeStyles({
  filtered: {
    filter: 'opacity(20%)',
  },
})

export interface EventCellProps extends ColorEventCellProps<SectionGroupEvent> {}

const EventCell = ({
  event,
  className,
  ...props
}: EventCellProps) => {
  const { isFiltered } = event

  const classes = useStyles()

  return (
    <ColoredEventCell
      event={event}
      className={clsx(
        { [classes.filtered]: isFiltered },
        className,
      )}
      {...props}
    />
  )
}

export default EventCell
