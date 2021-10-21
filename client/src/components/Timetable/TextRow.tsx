import React from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import TableRow from './TableRow'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export interface TextRowProps extends React.ComponentPropsWithoutRef<typeof TableRow> {}

const TextRow = ({
  contentProps,
  children,
  ...props
}: TextRowProps) => {
  const {
    className: contentClassName,
    ...otherContentProps
  } = contentProps || {}

  const classes = useStyles()

  return (
    <TableRow
      contentProps={{
        className: clsx(classes.root, contentClassName),
        ...otherContentProps,
      }}
      {...props}
    >
      <Typography variant="inherit" color="textSecondary">
        {children}
      </Typography>
    </TableRow>
  )
}

export default TextRow
