import React from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import LinearProgress from '@material-ui/core/LinearProgress'

const useStyles = makeStyles({
  root: {
    position: 'absolute',
    top: '0px',
    left: '0px',
    zIndex: 100,
  },
})

export interface LoadingBarProps extends React.ComponentPropsWithoutRef<typeof LinearProgress> {
  width?: string
  height?: string
}

const LoadingBar = ({
  width,
  height,
  className,
  style,
  ...props
}: LoadingBarProps) => {
  const classes = useStyles()

  return (
    <LinearProgress
      className={clsx(classes.root, className)}
      style={{ width, height, ...style }}
      {...props}
    />
  )
}

LoadingBar.defaultProps = {
  width: '100%',
}

export default LoadingBar
