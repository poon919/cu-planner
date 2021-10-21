import React from 'react'

import Timetable, { EventRow } from '../components/Timetable'

export default {
  component: Timetable,
  title: 'Timetable',
}

const DATA = [
  {
    header: 'MO',
    events: [
      {
        id: 0,
        start: new Date(0, 0, 0, 9, 0),
        end: new Date(0, 0, 0, 10, 0),
        text: 'LOREM IPSUM DOLOR SIT AMET CONSECTETUR',
      },
    ],
  },
  {
    header: 'TU',
    events: [
      {
        id: 1,
        start: new Date(0, 0, 0, 10, 30),
        end: new Date(0, 0, 0, 11, 30),
        text: 'EXP ENG I',
      },
      {
        id: 2,
        start: new Date(0, 0, 0, 11, 30),
        end: new Date(0, 0, 0, 15, 20),
        text: 'STAT I',
      },
    ],
  },
  {
    header: 'WE',
    events: [
      {
        id: 3,
        start: new Date(0, 0, 0, 13, 0),
        end: new Date(0, 0, 0, 15, 0),
        text: 'THIS SHOULD LAY ON THE FIRST ROW',
      },
      {
        id: 4,
        start: new Date(0, 0, 0, 14, 0),
        end: new Date(0, 0, 0, 15, 30),
        text: 'THIS SHOULD LAY ON THE 2ND ROW',
      },
    ],
  },
  {
    header: 'TH',
    events: [],
  },
  {
    header: 'FR',
    events: [
      {
        id: 5,
        start: new Date(0, 0, 0, 8, 0),
        end: new Date(0, 0, 0, 16, 0),
        text: 'LAST ROW',
      },
    ],
  },
]

export const Default = () => (
  <Timetable startHour={8} endHour={16}>
    {DATA.map((row) => <EventRow key={row.header} header={row.header} events={row.events} />)}
  </Timetable>
)
