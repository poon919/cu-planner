import React from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'

import { Section, Timetable } from '../../models'
import { isRegTimeDeclared, toTimeString } from '../../utils'

export interface SectionDetailProps {
  timetable: Timetable
}

const SectionDetail = ({
  timetable,
}: SectionDetailProps) => {
  const {
    method,
    days,
    time,
    building,
    room,
    instructor,
    note,
  } = timetable

  return (
    <>
      <TableCell>{method}</TableCell>
      <TableCell>
        {isRegTimeDeclared(time)
          ? (
            <>
              {days.join(' ')}
              <br />
              {`${toTimeString(time.start)}`}
              &#8209;
              {`${toTimeString(time.end)}`}
            </>
          )
          : time.status}
      </TableCell>
      <TableCell>{building}</TableCell>
      <TableCell>{room}</TableCell>
      <TableCell>{instructor}</TableCell>
      <TableCell>{note}</TableCell>
    </>
  )
}

const useStyles = makeStyles((theme) => ({
  closed: {
    backgroundColor: theme.palette.grey[200],
  },
  hasSeat: {
    color: theme.palette.success.main,
  },
  noSeat: {
    color: theme.palette.error.main,
  },
}))

export interface SectionRowProps {
  section: Section
}

const SectionRow = ({
  section,
}: SectionRowProps) => {
  const {
    isOpen,
    no,
    registered,
    maxRegister,
    timetables,
  } = section

  const classes = useStyles()

  return (
    <TableBody className={clsx({ [classes.closed]: !isOpen })}>
      <TableRow>
        <TableCell
          className={clsx({
            [classes.hasSeat]: isOpen && registered < maxRegister,
            [classes.noSeat]: isOpen && registered >= maxRegister,
          })}
        >
          {isOpen
            ? `${no} (${registered}/${maxRegister})`
            : `${no} (closed)`}
        </TableCell>
        <SectionDetail timetable={timetables[0]} />
      </TableRow>
      {timetables.slice(1).map((tt, i) => (
        <TableRow
          key={
            i // eslint-disable-line react/no-array-index-key
          }
        >
          <TableCell />
          <SectionDetail timetable={tt} />
        </TableRow>
      ))}
    </TableBody>
  )
}

export default SectionRow
