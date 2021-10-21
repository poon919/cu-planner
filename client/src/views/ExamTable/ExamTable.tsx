import React from 'react'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'

import SubTable from './SubTable'
import { ExamTableProps } from './interfaces'

export const ExamTable = ({
  appState,
  onViewCourse,
}: ExamTableProps) => (
  <div>
    <div>
      <Typography variant="h6">
        Midterm
      </Typography>
      <Divider />
    </div>
    <SubTable
      appState={appState}
      examType="midterm"
      onViewCourse={onViewCourse}
    />
    <Typography variant="h6">
      Final
    </Typography>
    <Divider />
    <SubTable
      appState={appState}
      examType="final"
      onViewCourse={onViewCourse}
    />
  </div>
)

export default ExamTable
