import React from 'react'
import Paper from '@material-ui/core/Paper'

import { EventCellProps, TableEvent } from './interfaces'

const EventCell = <T extends TableEvent>({
  event,
  children,
  ...props
}: EventCellProps<T>) => (
  <Paper
    elevation={1}
    {...props}
  >
    {children}
  </Paper>
  )

export default EventCell
