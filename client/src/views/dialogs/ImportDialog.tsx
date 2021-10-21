import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'

import { Preset } from '../../models'
import { decodePreset, onFocusSelectTextHandler } from '../../utils'
import LargeAlert from '../../components/LargeAlert'
import {
  Dialog,
  DialogContent,
  DialogActions,
} from '../../components/Dialog'
import { COMMENT_PREFIX } from './const'

const stripComments = (str: string) => str
  .split('\n')
  .reduce((acc, line) => (line.startsWith(COMMENT_PREFIX) ? acc : acc + line), '')

const useStyles = makeStyles((theme) => ({
  presetCode: {
    '& > .MuiInputBase-root': {
      ...theme.typography.body2,
    },
  },
}))

export interface ImportDialogProps {
  open: boolean
  onClose?: () => void
  onImport: (preset: Omit<Preset, 'id'>) => void
}

const ImportDialog = ({
  open,
  onClose,
  onImport,
}: ImportDialogProps) => {
  const [data, setData] = useState('')
  const [isErr, setIsErr] = useState(false)

  const handleSubmit = () => {
    if (isErr) {
      setData('')
      setIsErr(false)
      return
    }

    const preset = decodePreset(stripComments(data))
    if (preset === null) {
      setIsErr(true)
      return
    }
    onImport(preset)
  }

  const classes = useStyles()

  let children = (
    <TextField
      autoFocus
      multiline
      rowsMax={10}
      fullWidth
      variant="outlined"
      size="small"
      placeholder="Enter preset code here"
      value={data}
      onChange={(e) => setData(e.target.value)}
      onFocus={onFocusSelectTextHandler}
      className={classes.presetCode}
    />
  )

  if (isErr) {
    children = (
      <LargeAlert
        severity="error"
        title="Import failed"
        borderless
      >
        Preset data was corrupted
      </LargeAlert>
    )
  }

  return (
    <Dialog
      title="Import Preset"
      open={open}
      onClose={onClose}
    >
      <DialogContent>
        {children}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          {isErr ? 'Try again' : 'Import'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ImportDialog
