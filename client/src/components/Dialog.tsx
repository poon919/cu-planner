import React from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import MuiDialog from '@material-ui/core/Dialog'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import MuiDialogContent from '@material-ui/core/DialogContent'
import MuiDialogContentText from '@material-ui/core/DialogContentText'
import MuiDialogActions from '@material-ui/core/DialogActions'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'

const useTitleStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(0.5, 3),
  },
}))

interface DialogTitleProps extends Omit<React.ComponentPropsWithoutRef<typeof MuiDialogTitle>, 'disableTypography'> {
  onClose?: () => void
}

const DialogTitle = ({
  className,
  children,
  onClose,
  ...props
}: DialogTitleProps) => {
  const classes = useTitleStyles()

  return (
    <MuiDialogTitle disableTypography className={clsx(classes.root, className)} {...props}>
      <Typography variant="h6">{children}</Typography>
      {onClose && (
        <IconButton
          aria-label="close-dialog"
          title="Close"
          onClick={onClose}
          edge="end"
        >
          <CloseIcon />
        </IconButton>
      )}
    </MuiDialogTitle>
  )
}

const useDialogStyles = makeStyles((theme) => ({
  diagPaper: {
    [theme.breakpoints.down('xs')]: {
      width: `calc(100% - ${theme.spacing(1) * 2}px)`,
      margin: theme.spacing(1),
    },
  },
}))

export interface DialogProps extends React.ComponentPropsWithoutRef<typeof MuiDialog> {
  title?: string
  onClose?: () => void
}

const Dialog = ({
  title,
  open,
  onClose,
  children,
  ...props
}: DialogProps) => {
  const classes = useDialogStyles()

  return (
    <MuiDialog
      maxWidth="sm"
      fullWidth
      open={open}
      onClose={() => onClose?.()}
      PaperProps={{
        className: classes.diagPaper,
      }}
      {...props}
    >
      <DialogTitle onClose={onClose}>{title}</DialogTitle>
      {children}
    </MuiDialog>
  )
}

export default Dialog

export {
  Dialog,
  MuiDialogContent as DialogContent,
  MuiDialogContentText as DialogContentText,
  MuiDialogActions as DialogActions,
}
