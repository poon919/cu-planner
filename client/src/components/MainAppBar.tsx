import React from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Hidden from '@material-ui/core/Hidden'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import SearchIcon from '@material-ui/icons/Search'
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks'

import Header from './Header'

const useStyles = makeStyles((theme) => ({
  container: {
    height: '100%',
    overflow: 'hidden',
  },
  content: {
    height: '100%',
    position: 'relative',
    overflowX: 'auto',
  },
  main: {
    flex: '0 0 auto',
    width: `${(8 / 12) * 100}%`,
    transition: 'width 0.5s',
  },
  growMain: {
    width: '100%',
  },
  sidebar: {
    flex: '0 0 auto',
    width: `${(4 / 12) * 100}%`,
    transition: 'transform 0.5s',
  },
  hideSidebar: {
    transform: 'translate(100%)',
  },
  presetsIconButton: {
    [theme.breakpoints.down('md')]: {
      marginRight: -theme.spacing(1.5),
    },
  },
}))

export interface MainAppBarProps extends React.ComponentPropsWithoutRef<'main'> {
  sidebarProps?: React.ComponentPropsWithoutRef<'div'>
  sidebar?: React.ReactNode
  showSidebar?: boolean
  disableActions?: boolean
  onMenuClick: () => void
  onShowPresets: () => void
  onFindCourse: () => void
}

const MainAppBar = ({
  sidebarProps,
  sidebar,
  showSidebar,
  disableActions,
  onMenuClick,
  onShowPresets,
  onFindCourse,
  className,
  children,
  ...props
}: MainAppBarProps) => {
  const {
    className: sbClassName,
    ...restSbProps
  } = sidebarProps || {}

  const classes = useStyles()

  const leftAction = (
    <IconButton
      edge="start"
      color="inherit"
      aria-label="show-menu"
      title="Menu"
      disabled={disableActions}
      onClick={onMenuClick}
    >
      <MenuIcon />
    </IconButton>
  )

  const rightAction = (
    <Grid container alignItems="center">
      <IconButton
        edge="end"
        color="inherit"
        aria-label="show-course-finder"
        title="Find courses"
        disabled={disableActions}
        onClick={onFindCourse}
      >
        <SearchIcon />
      </IconButton>
      <IconButton
        color="inherit"
        aria-label="show-presets"
        title="Show presets"
        onClick={onShowPresets}
        className={classes.presetsIconButton}
      >
        <LibraryBooksIcon />
      </IconButton>
    </Grid>
  )

  return (
    <Header leftAction={leftAction} rightAction={rightAction}>
      <Hidden lgUp>
        <main className={clsx(classes.content, className)} {...props}>
          {children}
        </main>
      </Hidden>
      <Hidden mdDown>
        <Grid
          component="main"
          container
          wrap="nowrap"
          className={classes.container}
        >
          <Grid
            item
            className={clsx(
              classes.content,
              classes.main,
              { [classes.growMain]: !showSidebar },
              className,
            )}
            {...props}
          >
            {children}
          </Grid>
          <Grid
            item
            className={clsx(
              classes.content,
              classes.sidebar,
              { [classes.hideSidebar]: !showSidebar },
              sbClassName,
            )}
            {...restSbProps}
          >
            {sidebar}
          </Grid>
        </Grid>
      </Hidden>
    </Header>
  )
}

export default MainAppBar
