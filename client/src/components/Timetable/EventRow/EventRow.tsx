import React, { useContext } from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'

import TableContext from '../Context'
import TableRow from '../TableRow'
import RowGrid from './RowGrid'
import EventCell from './EventCell'
import { EventRowProps, TableEvent } from './interfaces'

const hourDiff = (baseHour: number, d: Date) => (
  Math.abs(d.getHours() + d.getMinutes() / 60 - baseHour)
)

const isOverlapped = (t1: TableEvent, t2: TableEvent) => (
  !(t1.end <= t2.start || t2.end <= t1.start)
)

const wrapEvents = <T extends TableEvent>(events: T[]) => {
  if (events.length === 0) {
    return [[]]
  }

  const rows: T[][] = []
  const copy = [...events]
  copy
    .sort((a, b) => a.start.getTime() - b.start.getTime() || a.end.getTime() - b.end.getTime())
    .forEach((event) => {
      let i = 0
      // Find non-overlapping row
      while (i < rows.length && isOverlapped(event, rows[i][rows[i].length - 1])) { i++ }
      // Add a new row if necessary
      if (i === rows.length) { rows.push([]) }
      rows[i].push(event)
    })
  return rows
}

const useStyles = makeStyles((theme) => ({
  root: {
    '& > div + div': {
      borderTop: `1px solid ${theme.palette.border.secondary}`,
    },
  },
  conflict: {
    '& .tt-rht': {
      color: theme.palette.error.main,
    },
  },
}))

export const EventRow = <T extends TableEvent>({
  header,
  events,
  rowHeight,
  contentProps,
  cellComponent: Cell,
  className,
  onEventClick,
  onEventDoubleClick,
  ...props
}: EventRowProps<T>) => {
  const {
    startHour,
    endHour,
  } = useContext(TableContext)

  const {
    className: contentClassName,
    ...otherContentProps
  } = contentProps || {}

  const rows = wrapEvents(events)

  const classes = useStyles()

  return (
    <TableRow
      header={header}
      className={clsx({ [classes.conflict]: rows.length > 1 }, className)}
      contentProps={{
        className: clsx(classes.root, contentClassName),
        ...otherContentProps,
      }}
      {...props}
    >
      {rows.map((row, i) => (
        <RowGrid
          key={
            i // eslint-disable-line react/no-array-index-key
          }
          columns={endHour - startHour}
          rowHeight={rowHeight}
        >
          {row.map((event) => {
            const { start, end } = event
            const left = (hourDiff(startHour, start) / (endHour - startHour)) * 100
            const right = (hourDiff(endHour, end) / (endHour - startHour)) * 100

            const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
              e.stopPropagation()
              onEventClick?.(event, e)
            }

            const handleDoubleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
              e.stopPropagation()
              onEventDoubleClick?.(event, e)
            }

            return (
              <Cell
                key={event.id}
                event={event}
                style={{
                  position: 'absolute',
                  top: '0px',
                  left: `${left}%`,
                  // Offset right border for 1px
                  right: `calc(${right}% + 1px)`,
                  height: '100%',
                }}
                onClick={handleClick}
                onDoubleClick={handleDoubleClick}
              />
            )
          })}
        </RowGrid>
      ))}
    </TableRow>
  )
}

EventRow.defaultProps = {
  rowHeight: '3rem',
  cellComponent: EventCell,
}

export default EventRow
