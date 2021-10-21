import React, { useContext } from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import TableContext from '../Context'

interface StyleProps {
  rowHeaderWidth: string
}

const useStyles = makeStyles((theme) => ({
  root: (props: StyleProps) => ({
    display: 'flex',
    flex: '0 0 auto',
    width: props.rowHeaderWidth,
  }),
  headerCell: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex: '1 0 auto',
  },
  headerText: {
    fontFamily: `"Roboto Mono", ${theme.typography.fontFamily}`,
    marginRight: theme.spacing(1),
    display: 'inline-block',
    color: theme.palette.text.secondary,
  },
  bordered: {
    flex: '0 0 auto',
    width: '10px',
    borderTop: `1px solid ${theme.palette.border.primary}`,
  },
}))

export interface RowHeaderProps {
  children?: string
  borderless?: boolean
}

const RowHeader = ({
  children,
  borderless,
}: RowHeaderProps) => {
  const props = useContext(TableContext)

  const classes = useStyles(props)

  return (
    <div className={clsx('tt-rh', classes.root)}>
      <div className={classes.headerCell}>
        {children && (
        <Typography variant="inherit" className={clsx('tt-rht', classes.headerText)}>
          {children}
        </Typography>
        )}
      </div>
      <div className={clsx({ [classes.bordered]: !borderless })} />
    </div>
  )
}

export default RowHeader
