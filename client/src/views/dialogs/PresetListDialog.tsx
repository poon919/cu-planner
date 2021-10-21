import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import SvgIcon from '@material-ui/core/SvgIcon'
import AddIcon from '@material-ui/icons/Add'

import { parseProgram, parseSemester } from '../../utils'
import { PresetInfo } from '../../models'
import { PresetList, PresetListItem } from '../../components/PresetList'
import LargeAlert from '../../components/LargeAlert'
import {
  Dialog,
  DialogContent,
} from '../../components/Dialog'

// svg path taken from https://materialdesignicons.com/icon/application-import
const ImportIcon = (props: React.ComponentPropsWithoutRef<typeof SvgIcon>) => (
  <SvgIcon {...props}>
    <path
      fill="currentColor"
      d="M14,12L10,8V11H2V13H10V16M20,18V6C20,4.89 19.1,4 18,4H6A2,2 0 0,0 4,6V9H6V6H18V18H6V15H4V18A2,2 0 0,0 6,20H18A2,2 0 0,0 20,18Z"
    />
  </SvgIcon>
)

const useStyles = makeStyles((theme) => ({
  actions: {
    marginBottom: theme.spacing(1),
  },
}))

export interface PresetListDialogProps {
  open: boolean
  onClose?: () => void
  presets: PresetInfo[]
  selected?: number
  onSelectPreset: (id: number) => void
  onEditPreset: (id: number) => void
  onDeletePreset: (id: number) => void
  onCreatePreset: () => void
  onImportPreset: () => void
}

const PresetListDialog = ({
  open,
  presets,
  selected,
  onClose,
  onSelectPreset,
  onEditPreset,
  onDeletePreset,
  onCreatePreset,
  onImportPreset,
}: PresetListDialogProps) => {
  const classes = useStyles()

  let children = (
    <LargeAlert
      severity="info"
      title="No presets"
      borderless
    />
  )
  if (presets.length > 0) {
    children = (
      <PresetList disablePadding>
        {presets.map((preset) => {
          const {
            id,
            name,
            program,
            acadyear,
            semester,
          } = preset

          return (
            <PresetListItem
              key={id}
              button
              divider
              selected={id === selected}
              onClick={() => onSelectPreset(id)}
              onEdit={() => onEditPreset(id)}
              onDelete={() => onDeletePreset(id)}
              primary={name}
              secondary={`${parseSemester(program, semester)} ${parseProgram(program)} ${acadyear}`}
            />
          )
        })}
      </PresetList>
    )
  }

  return (
    <Dialog
      title="Presets"
      open={open}
      onClose={onClose}
    >
      <DialogContent>
        <Grid container spacing={1} className={classes.actions}>
          <Grid item xs={6}>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<ImportIcon />}
              onClick={() => onImportPreset()}
              fullWidth
            >
              Import
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => onCreatePreset()}
              fullWidth
            >
              New
            </Button>
          </Grid>
        </Grid>
        {children}
      </DialogContent>
    </Dialog>
  )
}

export default PresetListDialog
