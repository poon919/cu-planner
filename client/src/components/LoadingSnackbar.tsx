import React, { useRef, useState, useEffect } from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'

import Snackbar from '@material-ui/core/Snackbar'

const useStyles = makeStyles((theme) => ({
  content: {
    padding: theme.spacing(0, 2),
    '& .MuiSnackbarContent-message': {
      width: '100%',
      textAlign: 'center',
      animation: theme.animations.blinker,
    },
  },
}))

export interface LoadingSnackbarProps extends React.ComponentPropsWithoutRef<typeof Snackbar> {
  message?: string
}

const LoadingSnackbar = ({
  message,
  ContentProps,
  ...props
}: LoadingSnackbarProps) => {
  const msgTimeout = useRef<number>()
  const [open, setOpen] = useState(false)
  const [displayMessage, setDisplayMessage] = useState('')

  const {
    className: contentClassName,
    ...restContentProps
  } = ContentProps || {}

  useEffect(() => {
    if (message) {
      window.clearTimeout(msgTimeout.current)
      setOpen(true)
      setDisplayMessage(message)
    } else {
      setOpen(false)
      // Delayed until Snackbar left screen.
      // Default theme's leavingScreen duration = 195
      msgTimeout.current = window.setTimeout(() => {
        setDisplayMessage('')
      }, 500)
    }
  }, [message])

  const classes = useStyles()

  return (
    <Snackbar
      open={open}
      message={displayMessage}
      ContentProps={{
        className: clsx(classes.content, contentClassName),
        ...restContentProps,
      }}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      {...props}
    />
  )
}

export default LoadingSnackbar
