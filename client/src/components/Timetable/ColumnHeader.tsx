import React, { useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import { range } from '../../utils'
import TableContext from './Context'
import TableRow from './TableRow'

interface StyleProps {
  rowHeaderWidth: string
  colMinWidth: string
}

const useStyles = makeStyles((theme) => ({
  textRoot: {
    display: 'flex',
    minWidth: '100%',
  },
  borderRoot: {
    display: 'flex',
    height: '10px',
    borderLeft: `1px solid ${theme.palette.border.primary}`,
    '& > div': {
      borderRight: `1px solid ${theme.palette.border.primary}`,
    },
  },
  headerOffset: (props: StyleProps) => ({
    display: 'flex',
    justifyContent: 'flex-end',
    flex: '0 0 auto',
    width: props.rowHeaderWidth,
  }),
  column: (props: StyleProps) => ({
    flex: '1 0 auto',
    width: props.colMinWidth,
    textAlign: 'right',
  }),
  hourText: {
    fontFamily: `"Roboto Mono", ${theme.typography.fontFamily}`,
    display: 'inline-block',
    transform: 'translateX(50%)',
    color: theme.palette.text.secondary,
  },
}))

const ColumnHeader = () => {
  const {
    startHour,
    endHour,
    ...styleProps
  } = useContext(TableContext)

  const classes = useStyles(styleProps)

  return (
    <>
      <div className={classes.textRoot}>
        <div className={classes.headerOffset}>
          <Typography className={classes.hourText}>
            {startHour}
          </Typography>
        </div>
        {range(startHour + 1, endHour + 1, (i) => (
          <div key={i} className={classes.column}>
            <Typography className={classes.hourText}>
              {i}
            </Typography>
          </div>
        ))}
      </div>
      <TableRow
        contentProps={{
          className: classes.borderRoot,
        }}
        borderless
      >
        {range(startHour + 1, endHour + 1, (i) => (
          <div key={i} className={classes.column} />
        ))}
      </TableRow>
    </>
  )
}

export default ColumnHeader
