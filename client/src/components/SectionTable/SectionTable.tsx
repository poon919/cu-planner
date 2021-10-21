import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'

import SectionRow from './Row'
import { SectionTableProps } from './interfaces'

const useStyles = makeStyles((theme) => ({
  root: {
    '& td': {
      padding: theme.spacing(1),
    },
    '& tr:last-child > td, & tr:last-child > th': {
      borderBottom: `1px solid ${theme.palette.border.primary}`,
    },
  },
}))

const SectionTable = React.memo(({
  sections,
}: SectionTableProps) => {
  const classes = useStyles()

  return (
    <Table className={classes.root}>
      <TableHead>
        <TableRow>
          <TableCell>Section</TableCell>
          <TableCell>Method</TableCell>
          <TableCell>Time</TableCell>
          <TableCell>Building</TableCell>
          <TableCell>Room</TableCell>
          <TableCell>Instructor</TableCell>
          <TableCell>Note</TableCell>
        </TableRow>
      </TableHead>
      {sections.map((sec) => (
        <SectionRow
          key={sec.no}
          section={sec}
        />
      ))}
    </Table>
  )
})

export default SectionTable
