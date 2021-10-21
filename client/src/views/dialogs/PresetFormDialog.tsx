import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Alert from '@material-ui/lab/Alert'

import { PresetInfo, Program, Semester } from '../../models'
import PresetForm, { useManagedForm } from '../../components/forms/PresetForm'
import {
  Dialog,
  DialogContent,
  DialogActions,
} from '../../components/Dialog'

const dialogVariants = {
  default: {
    title: '',
    submitText: 'SUBMIT',
  },
  create: {
    title: 'Create Preset',
    submitText: 'CREATE',
  },
  import: {
    title: 'Import Preset',
    submitText: 'IMPORT',
  },
  edit: {
    title: 'Edit Preset',
    submitText: 'EDIT',
  },
}

export type PresetFormVariants = keyof typeof dialogVariants

export interface PresetFormDialogProps {
  open: boolean
  onClose?: () => void
  variant?: PresetFormVariants
  defaultValues?: Omit<PresetInfo, 'id'>
  validSemesters?: string[]
  onSubmit: (values: Omit<PresetInfo, 'id'>) => void
}

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiInputLabel-root': {
      padding: 'inherit',
    },
  },
  alertBox: {
    marginTop: theme.spacing(1),
  },
}))

const PresetFormDialog = ({
  open,
  variant,
  defaultValues,
  validSemesters,
  onSubmit,
  onClose,
}: PresetFormDialogProps) => {
  const {
    title,
    submitText,
  } = dialogVariants[variant || 'default']

  const { form } = useManagedForm({
    defaultValues: defaultValues && ({
      name: defaultValues.name,
      program: defaultValues.program,
      acadyear: defaultValues.acadyear.toString(),
      semester: defaultValues.semester,
    }),
  })

  const {
    name,
    program,
    semester,
    acadyear,
  } = form.values

  const submittable = Object
    .values(form.errors)
    .every((err) => !err)

  const handleSubmit = () => {
    if (!submittable) {
      return
    }

    onSubmit({
      name,
      program: program as Program,
      acadyear: +acadyear,
      semester: semester as Semester,
    })
  }

  const classes = useStyles()

  return (
    <Dialog
      title={title}
      open={open}
      onClose={onClose}
    >
      <DialogContent>
        <Grid container direction="column">
          <Grid
            container
            spacing={1}
            className={classes.root}
          >
            <Grid item xs={12}>
              <PresetForm.PresetNameField form={form} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <PresetForm.ProgramSelect form={form} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <PresetForm.SemesterSelect form={form} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <PresetForm.AcadyearField form={form} />
            </Grid>
          </Grid>
          {validSemesters
            && validSemesters.indexOf(`${program}${acadyear}${semester}`) < 0
            && <Alert severity="warning" className={classes.alertBox}>No data for this semester</Alert>}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button disabled={!submittable} onClick={handleSubmit} color="primary">
          {submitText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default PresetFormDialog
