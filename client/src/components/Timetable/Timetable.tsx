import React from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'

import TableContext from './Context'
import ColumnHeader from './ColumnHeader'
import { TimetableProps } from './interfaces'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'inline-block',
    minWidth: '100%',
    paddingTop: theme.spacing(1),
    paddingRight: theme.typography.body1.fontSize,
    [`& .tt-r:nth-last-child(1) .tt-rc,
      & .tt-r:nth-last-child(1) .tt-rh > div:nth-child(2)`]: {
      borderBottom: `1px solid ${theme.palette.border.primary}`,
    },
  },
}))

export const Timetable = ({
  startHour,
  endHour,
  rowHeaderWidth,
  colMinWidth,
  tableProps,
  className,
  children,
  ...props
}: TimetableProps) => {
  const contextValue = {
    startHour,
    endHour,
    rowHeaderWidth,
    colMinWidth,
  }
  const {
    className: tableClassName,
    ...otherTableProps
  } = tableProps || {}

  const classes = useStyles()

  return (
    <TableContext.Provider value={contextValue}>
      <div className={clsx(classes.root, tableClassName)} {...otherTableProps}>
        <ColumnHeader />
        <div {...props}>
          {children}
        </div>
      </div>
    </TableContext.Provider>
  )
}

Timetable.defaultProps = {
  rowHeaderWidth: '100px',
  colMinWidth: '100px',
}

export default Timetable
