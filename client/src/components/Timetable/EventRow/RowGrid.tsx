import React from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'

import { range } from '../../../utils'

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    display: 'flex',
    minWidth: '100%',
    marginRight: '-1px',
  },
  column: {
    flex: '1 0 auto',
    borderRight: `1px solid ${theme.palette.border.secondary}`,
  },
}))

export interface RowGridProps extends React.ComponentPropsWithoutRef<'div'> {
  columns: number
  rowHeight: string
  children?: React.ReactNode
}

const RowGrid = ({
  columns,
  rowHeight,
  className,
  style,
  children,
  ...props
}: RowGridProps) => {
  const classes = useStyles()

  return (
    <div
      className={clsx(classes.root, className)}
      style={{ height: rowHeight, ...style }}
      {...props}
    >
      {range(0, columns, (i) => (
        <div key={i} className={classes.column} />
      ))}
      {children}
    </div>
  )
}

export default RowGrid
