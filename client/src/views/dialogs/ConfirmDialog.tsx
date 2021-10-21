import React from 'react'
import Button from '@material-ui/core/Button'

import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '../../components/Dialog'

export interface ConfirmDialogProps {
  open: boolean
  title: string
  cancelText: string
  confirmText: string
  children?: React.ReactNode
  onClose?: () => void,
  onConfirm: () => void,
}

const ConfirmDialog = ({
  open,
  title,
  cancelText,
  confirmText,
  children,
  onClose,
  onConfirm,
}: ConfirmDialogProps) => (
  <Dialog
    title={title}
    open={open}
    onClose={onClose}
  >
    {children
      ? (
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            {children}
          </DialogContentText>
        </DialogContent>
      )
      : null}
    <DialogActions>
      <Button onClick={onClose} color="primary">
        {cancelText}
      </Button>
      <Button onClick={onConfirm} color="primary">
        {confirmText}
      </Button>
    </DialogActions>
  </Dialog>
)

ConfirmDialog.defaultProps = {
  cancelText: 'Cancel',
  confirmText: 'Confirm',
}

export default ConfirmDialog
