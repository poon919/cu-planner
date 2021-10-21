import React from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'

import RowHeader from './RowHeader'
import { TableRowProps } from './interfaces'

const useStyles = makeStyles((theme) => ({
  tableRow: {
    display: 'flex',
    minWidth: '100%',
  },
  content: {
    flex: '1 0 auto',
  },
  bordered: {
    borderTop: `1px solid ${theme.palette.border.primary}`,
    borderRight: `1px solid ${theme.palette.border.secondary}`,
    borderLeft: `1px solid ${theme.palette.border.secondary}`,
  },
}))

export const TableRow = ({
  header,
  contentProps,
  borderless,
  className,
  children,
  ...props
}: TableRowProps) => {
  const {
    className: contentClassName,
    ...otherContentProps
  } = contentProps || {}

  const classes = useStyles()

  return (
    <div
      className={clsx('tt-r', classes.tableRow, className)}
      {...props}
    >
      <RowHeader borderless={borderless}>{header}</RowHeader>
      <div
        className={clsx(
          'tt-rc',
          classes.content,
          { [classes.bordered]: !borderless },
          contentClassName,
        )}
        {...otherContentProps}
      >
        {children}
      </div>
    </div>
  )
}

export default TableRow
