import React from 'react'
import MenuItem from '@material-ui/core/MenuItem'

import {
  currentAcadyear,
  parseProgram,
  parseSemester,
  onFocusSelectTextHandler,
} from '../../utils'
import { Program, Semester } from '../../models'
import { createForm } from './form'

const PROGRAMS: Program[] = ['S', 'T', 'I']
const SEMESTERS: Semester[] = ['1', '2', '3']
const reAcadYear = /^[0-9]{4}$/

const defaultFormValues = {
  name: 'My preset',
  program: 'S',
  acadyear: currentAcadyear.toString(),
  semester: '1',
}

const { useManagedForm, createTextField } = createForm(
  defaultFormValues,
  {
    validator: (values) => {
      const { name, acadyear } = values
      const errs = {
        name: '',
        acadyear: '',
      }

      if (name.trim() === '') {
        errs.name = 'Incorrect value'
      } else if (name.length > 100) {
        errs.name = 'Preset name is too long'
      }

      if (!reAcadYear.exec(acadyear)) {
        errs.acadyear = 'Incorrect value'
      }

      return errs
    },
  },
)

const PresetNameField = createTextField({
  name: 'name',
  label: 'Name',
  fullWidth: true,
  autoComplete: 'off',
  onFocus: onFocusSelectTextHandler,
})

const programOptions = PROGRAMS.map((p) => [p, parseProgram(p)])

const ProgramSelect = createTextField({
  name: 'program',
  label: 'Program',
  select: true,
  fullWidth: true,
  children: programOptions.map(([value, label]) => (
    <MenuItem key={value} value={value}>
      {label}
    </MenuItem>
  )),
})

const SemesterSelect = createTextField({
  name: 'semester',
  label: 'Term',
  select: true,
  fullWidth: true,
  childrenRender: ({ program }) => {
    const semesterOptions = SEMESTERS.map((s) => [String(s), parseSemester(program, s)])
    return semesterOptions.map(([value, label]) => (
      <MenuItem key={value} value={value}>
        {label}
      </MenuItem>
    ))
  },
})

const AcadyearField = createTextField({
  name: 'acadyear',
  label: 'Year (AD)',
  fullWidth: true,
  autoComplete: 'off',
})

export { useManagedForm }

export default {
  PresetNameField,
  ProgramSelect,
  SemesterSelect,
  AcadyearField,
}
