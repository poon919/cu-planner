import React, { useState } from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import Grid, { GridSize } from '@material-ui/core/Grid'
import Drawer from '@material-ui/core/Drawer'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import Hidden from '@material-ui/core/Hidden'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import SearchIcon from '@material-ui/icons/Search'
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks'

import Header from '../components/Header'
import RouteList, { Route } from '../components/RouteList'

const useStyles = makeStyles((theme) => ({
  container: {
    height: '100%',
    overflow: 'hidden',
  },
  button: {
    height: '100%',
    marginRight: theme.spacing(1),
  },
  content: {
    height: '100%',
    position: 'relative',
    overflowX: 'auto',
  },
  growMain: {
    flexBasis: '100%',
    maxWidth: '100%',
  },
  hideSidebar: {
    flexBasis: '0%',
  },
  navContainer: {
    width: 250,
    maxWidth: '80%',
  },
  appTitle: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottom: `1px solid ${theme.palette.divider}`,
    ...theme.mixins.toolbar,
  },
  vertDivider: {
    marginRight: theme.spacing(1),
  },
}))

export interface MainAppBarProps extends React.ComponentPropsWithoutRef<'main'> {
  routes: Route[]
  sidebar?: React.ReactNode
  showSidebar?: boolean
  sidebarSize: GridSize
  sidebarProps?: React.ComponentPropsWithoutRef<'div'>
  disableActions?: boolean
  onRoute: (path: string) => void
  onShowPresetsClick: () => void
  onFindCourseClick: () => void
}

const MainAppBar = ({
  routes,
  sidebar,
  showSidebar,
  sidebarSize,
  sidebarProps,
  disableActions,
  onRoute,
  onShowPresetsClick,
  onFindCourseClick,
  className,
  children,
  ...props
}: MainAppBarProps) => {
  const {
    className: sbClassName,
    ...restSbProps
  } = sidebarProps || {}
  const [showNav, setShowNav] = useState(false)

  const handleRoute = (route: string) => {
    onRoute(route)
    setShowNav(false)
  }

  const classes = useStyles()

  const leftAction = (
    <>
      <Hidden smUp>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="show-menu"
          title="Menu"
          disabled={disableActions}
          onClick={() => setShowNav(true)}
        >
          <MenuIcon />
        </IconButton>
        <IconButton
          edge="end"
          color="inherit"
          aria-label="show-course-finder"
          title="Find courses"
          disabled={disableActions}
          onClick={onFindCourseClick}
        >
          <SearchIcon />
        </IconButton>
      </Hidden>
      <Hidden xsDown>
        {routes.map(({
          key,
          path,
          text,
        }) => (
          <Button
            key={key}
            variant="text"
            disabled={disableActions}
            onClick={() => handleRoute(path)}
            className={classes.button}
          >
            {text.primary}
          </Button>
        ))}
        <Divider flexItem orientation="vertical" className={classes.vertDivider} />
        <Button
          variant="text"
          startIcon={<SearchIcon />}
          disabled={disableActions}
          onClick={onFindCourseClick}
          className={classes.button}
        >
          Find Courses
        </Button>
      </Hidden>
    </>
  )

  const rightAction = (
    <IconButton
      edge="end"
      color="inherit"
      aria-label="show-presets"
      title="Show presets"
      onClick={onShowPresetsClick}
    >
      <LibraryBooksIcon />
    </IconButton>
  )

  return (
    <>
      <Header leftAction={leftAction} rightAction={rightAction}>
        <Grid
          component="main"
          container
          wrap="nowrap"
          className={classes.container}
        >
          <Grid
            item
            xs={(sidebarSize === 'auto' ? 'auto' : 12 - sidebarSize) as GridSize}
            className={clsx(
              classes.content,
              { [classes.growMain]: !showSidebar },
              className,
            )}
            {...props}
          >
            {children}
          </Grid>
          <Grid
            item
            xs={sidebarSize}
            className={clsx(
              classes.content,
              { [classes.hideSidebar]: !showSidebar },
              sbClassName,
            )}
            {...restSbProps}
          >
            {sidebar}
          </Grid>
        </Grid>
      </Header>
      <Drawer
        variant="temporary"
        anchor="left"
        open={showNav}
        onClose={() => setShowNav(false)}
        PaperProps={{ className: classes.navContainer }}
        ModalProps={{ keepMounted: true }}
      >
        <div className={classes.appTitle}>
          <Typography variant="h6" color="textSecondary">CU Planner</Typography>
        </div>
        <RouteList
          routes={routes}
          onRoute={handleRoute}
        />
      </Drawer>
    </>
  )
}

MainAppBar.defaultProps = {
  routes: [],
  sidebarSize: 4,
}

export default MainAppBar
