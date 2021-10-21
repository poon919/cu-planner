import React, { useState, useEffect, useRef } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import TextField from '@material-ui/core/TextField'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import DoneIcon from '@material-ui/icons/Done'

import { AppState } from '../../models'
import {
  encodePreset,
  onFocusSelectTextHandler,
  parseProgram,
  parseSemester,
} from '../../utils'
import {
  Dialog,
  DialogContent,
  DialogActions,
} from '../../components/Dialog'
import { COMMENT_PREFIX } from './const'

const comment = (...strs: string[]) => strs
  .map((s) => `${COMMENT_PREFIX} ${s}`)
  .join('\n')

const genComments = (exportName: string, appState: AppState) => {
  const { preset, courseData } = appState
  const {
    program,
    semester,
    courses,
  } = preset

  const arr = []
  arr.push(`${exportName}`)
  arr.push(`${parseSemester(program, semester)} ${parseProgram(program)}`)
  courses.forEach((code, i) => {
    const result = courseData[code]
    const courseName = result?.type === 'success' ? result.data.shortname : '-'
    arr.push(`${i + 1}. ${code} ${courseName}`)
  })
  return comment(...arr)
}

const useStyles = makeStyles((theme) => ({
  buttonContainer: {
    marginBottom: theme.spacing(1),
  },
  presetCode: {
    '& > .MuiInputBase-root': {
      ...theme.typography.body2,
    },
  },
  copied: {
    color: theme.palette.success.main,
    borderColor: theme.palette.success.main,
  },
}))

interface ExportCodeProps {
  exportName: string
  appState: AppState
  comments?: boolean
}

const PresetCodeField = ({
  exportName,
  appState,
  comments,
}: ExportCodeProps) => {
  const inputEl = useRef<HTMLInputElement>()
  const [data, setData] = useState('')
  const [copied, setCopied] = useState(false)
  const copyTimeout = useRef<number>()

  useEffect(() => {
    const { preset } = appState
    let encoded = encodePreset({
      ...preset,
      name: exportName,
    })
    if (comments) {
      encoded = `${genComments(exportName, appState)}\n${encoded}`
    }
    setData(encoded)
  }, [exportName, appState, comments])

  useEffect(() => {
    if (copied) {
      copyTimeout.current = window.setTimeout(() => setCopied(false), 3000)
    }
    return () => window.clearTimeout(copyTimeout.current)
  }, [copied])

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(data)
        .then(() => setCopied(true))
    } else if (inputEl.current) {
      inputEl.current.select()
      const success = document.execCommand('copy')
      setCopied(success)
    }
  }

  const classes = useStyles()

  const btnCopy = (
    <Button
      variant="outlined"
      color="primary"
      endIcon={<FileCopyIcon />}
      onClick={handleCopy}
      fullWidth
    >
      Copy to clipboard
    </Button>
  )

  const btnCopied = (
    <Button
      variant="outlined"
      endIcon={<DoneIcon />}
      className={classes.copied}
      fullWidth
    >
      Copied
    </Button>
  )

  return (
    <div>
      <Grid
        container
        justify="flex-end"
        alignItems="center"
        className={classes.buttonContainer}
      >
        {copied ? btnCopied : btnCopy}
      </Grid>
      <TextField
        inputRef={inputEl}
        multiline
        rowsMax={10}
        fullWidth
        variant="outlined"
        value={data}
        onFocus={onFocusSelectTextHandler}
        className={classes.presetCode}
        InputProps={{
          readOnly: true,
        }}
      />
    </div>
  )
}

export interface ExportDialogProps {
  open: boolean
  onClose?: () => void
  appState: AppState
}

const ExportDialog = ({
  open,
  onClose,
  appState,
}: ExportDialogProps) => {
  const [exportName, setExportName] = useState(appState.preset.name)
  const [confirmed, setConfirmed] = useState(false)
  const [comments, setComments] = useState(true)

  const handleCancel = () => {
    if (confirmed) {
      setConfirmed(false)
      return
    }
    onClose?.()
  }

  const handleSubmit = () => {
    if (confirmed) {
      onClose?.()
      return
    }
    setConfirmed(true)
  }

  return (
    <Dialog
      title="Export Preset"
      open={open}
      onClose={onClose}
    >
      <DialogContent>
        {confirmed
          ? (
            <PresetCodeField
              exportName={exportName}
              appState={appState}
              comments={comments}
            />
          )
          : (
            <>
              <TextField
                fullWidth
                label="Name"
                value={exportName}
                onChange={(e) => setExportName(e.target.value)}
                onFocus={onFocusSelectTextHandler}
              />
              <FormControlLabel
                label="Generate comments"
                control={(
                  <Checkbox
                    checked={comments}
                    color="primary"
                    onChange={(e) => setComments(e.target.checked)}
                  />
                )}
              />
            </>
          )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="primary">
          {confirmed ? 'Back' : 'Cancel'}
        </Button>
        <Button onClick={handleSubmit} color="primary">
          {confirmed ? 'Finish' : 'Export'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ExportDialog
