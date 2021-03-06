import React from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'

const useStyles = makeStyles((theme) => ({
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    '& > div': {
      width: 'auto',
    },
  },
  barOffset: theme.mixins.toolbar,
  content: {
    position: 'relative',
    height: `calc(100% - ${theme.mixins.toolbar.minHeight}px)`,
    overflowX: 'auto',
  },
}))

export interface HeaderProps extends React.ComponentPropsWithoutRef<typeof AppBar> {
  leftAction?: React.ReactNode
  rightAction?: React.ReactNode
  ToolbarProps?: React.ComponentPropsWithoutRef<typeof Toolbar>
}

const Header = ({
  leftAction,
  rightAction,
  ToolbarProps,
  children,
  ...props
}: HeaderProps) => {
  const {
    className: toolbarClassName,
    ...restToolbarProps
  } = ToolbarProps || {}

  const classes = useStyles()

  return (
    <>
      <AppBar
        component="div"
        color="primary"
        position="absolute"
        elevation={2}
        {...props}
      >
        <Toolbar
          className={clsx(classes.toolbar, toolbarClassName)}
          {...restToolbarProps}
        >
          <Grid container item justify="flex-start" alignItems="center">
            {leftAction}
          </Grid>
          <Grid container item justify="flex-end" alignItems="center">
            {rightAction}
          </Grid>
        </Toolbar>
      </AppBar>
      <div className={classes.barOffset} />
      <div className={classes.content}>
        {children}
      </div>
    </>
  )
}

export default Header
