import React, { useState, useEffect, useCallback } from 'react'
import {
  Switch,
  Route,
  Redirect,
  useHistory,
} from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import Container from '@material-ui/core/Container'
import Hidden from '@material-ui/core/Hidden'
import Drawer from '@material-ui/core/Drawer'
import Typography from '@material-ui/core/Typography'
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks'
import ScheduleIcon from '@material-ui/icons/Schedule'
import DateRangeIcon from '@material-ui/icons/DateRange'

import * as api from './api'
import * as db from './db'
import * as sels from './selectors'
import * as utils from './utils'
import {
  AppState,
  PresetInfo,
  CourseFilter,
} from './models'
import LoadingSnackbar from './components/LoadingSnackbar'
import DrawerWithHeader from './components/DrawerWithHeader'
import MainAppBar from './components/MainAppBar'
import RouteList from './components/RouteList'
import PresetDetail from './views/PresetDetail'
import PlannerTable from './views/PlannerTable'
import ExamTable from './views/ExamTable'
import CourseFinder from './views/CourseFinder'
import CourseDetail from './views/CourseDetail'
import DialogManager, { useDialog, PresetUpdateAction } from './views/DialogManager'
import Welcome from './views/Welcome'

const routes = [
  {
    key: 'mycourses',
    path: '/',
    icon: LibraryBooksIcon,
    text: { primary: 'My Courses' },
  },
  {
    key: 'timetable',
    path: '/timetable',
    icon: ScheduleIcon,
    text: { primary: 'Timetable' },
  },
  {
    key: 'exam',
    icon: DateRangeIcon,
    path: '/exam',
    text: { primary: 'Exam' },
  },
]

const usePresets = () => {
  const [presets, setPresets] = useState<PresetInfo[]>([])
  const fetchPresets = () => db.getAllPresetInfo().then(setPresets)

  return [presets, fetchPresets] as const
}

const useStyles = makeStyles((theme) => ({
  scrollPort: {
    width: '100%',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    overflowX: 'auto',
  },
  appTitle: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottom: `1px solid ${theme.palette.divider}`,
    ...theme.mixins.toolbar,
  },
  main: {
    [theme.breakpoints.up('lg')]: {
      paddingRight: theme.spacing(1.5),
    },
  },
  navContainer: {
    width: 250,
    maxWidth: '80%',
  },
  sidebarContainer: {
    paddingLeft: theme.spacing(1.5),
  },
  courseFinderDrawer: {
    [theme.breakpoints.up('lg')]: {
      width: '66%',
    },
  },
  courseFinderPaper: {
    [theme.breakpoints.up('lg')]: {
      width: '66%',
    },
    [theme.breakpoints.only('md')]: {
      width: '85%',
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  courseDetailPaper: {
    [theme.breakpoints.only('md')]: {
      width: '80%',
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  drawerChild: {
    paddingTop: theme.spacing(1),
  },
}))

const App = () => {
  const history = useHistory()
  const [firstLoaded, setFirstLoaded] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('Initializing...')
  const [showNav, setShowNav] = useState(false)
  const [showCourseFinder, setShowCourseFinder] = useState(false)
  const [showSidebar, setShowSidebar] = useState(true)
  const [curCourseCode, setCurCourseCode] = useState('')
  const [presets, fetchPresets] = usePresets()
  const [appState, setAppState] = useState<AppState | null>(null)
  const {
    dialog,
    showDialog,
    closeDialog,
  } = useDialog()

  const presetInfo = appState ? sels.selectPresetInfo(appState.preset) : null
  const courseData = appState ? appState.courseData : {}

  const loadPreset = async (id: number) => {
    const preset = await db.getPreset(id)
    if (!preset) {
      return
    }
    db.setLastPresetID(id)
    setAppState((state) => ({
      preset,
      courseData: state?.courseData || {},
    }))
    closeDialog()
  }

  const fetchCourse = useCallback(async (code: string, renew = true) => {
    if (!presetInfo) {
      return
    }
    setAppState((state) => {
      if (!state || presetInfo !== sels.selectPresetInfo(state.preset)) {
        return state
      }
      return {
        ...state,
        courseData: { ...state.courseData, [code]: { type: 'fetching' } },
      }
    })
    const result = await api.fetchCourse(presetInfo, code, renew)
    setAppState((state) => {
      if (!state || presetInfo !== sels.selectPresetInfo(state.preset)) {
        return state
      }
      return {
        ...state,
        courseData: { ...state.courseData, [code]: result },
      }
    })
  }, [presetInfo])

  const forceShowSidebar = useCallback(<T extends (...args: any) => any>(
    callback: T,
  ) => (...args: Parameters<T>): ReturnType<T> => {
      setShowSidebar(true)
      return callback(...args)
    }, [])

  useEffect(() => {
    const init = async () => {
      const id = db.getLastPresetID()
      await fetchPresets()
      await loadPreset(id)
      setFirstLoaded(true)
    }
    init()
  }, [])

  useEffect(() => {
    if (appState && sels.isFetching(appState)) {
      setLoadingMessage('Loading Courses...')
    } else if (firstLoaded) {
      setLoadingMessage('')
    }
  }, [firstLoaded, appState])

  useEffect(() => {
    if (appState) {
      setCurCourseCode('')
      setAppState({ ...appState, courseData: {} })
      appState.preset.courses.forEach((code) => fetchCourse(code, false))
    }
  }, [presetInfo])

  const handleRoute = (path: string) => {
    history.push(path)
    setShowNav(false)
  }

  const handlePresetUpdated = async (id: number, action: PresetUpdateAction) => {
    await fetchPresets()

    switch (action) {
      case 'added':
      case 'edited': {
        loadPreset(id)
        break
      }
      case 'deleted':
        if (presetInfo?.id === id) {
          setAppState(null)
          db.setLastPresetID(-1)
          showDialog.presetList()
        }
        break
      default:
        break
    }
  }

  const viewCourse = useCallback((renew: boolean) => async (code: string) => {
    setCurCourseCode(code)
    if (!renew && courseData[code]) {
      return
    }
    await fetchCourse(code, renew)
  }, [courseData, fetchCourse])

  const handleViewCourse = useCallback(viewCourse(false), [viewCourse])
  const handleForceViewCourse = useCallback(
    forceShowSidebar(handleViewCourse),
    [forceShowSidebar, handleViewCourse],
  )
  const handleForceViewRenewedCourse = useCallback(
    forceShowSidebar(viewCourse(true)),
    [forceShowSidebar, viewCourse],
  )

  const handleDeselectCourse = () => {
    setCurCourseCode('')
    setAppState((state) => {
      if (!state || state.preset.courses.indexOf(curCourseCode) >= 0) {
        return state
      }
      const { [curCourseCode]: deleted, ...others } = state.courseData
      return { ...state, courseData: others }
    })
  }

  const handleDeleteCourse = async (code: string) => {
    if (!presetInfo) {
      return
    }
    const preset = await db.deletePresetCourse(presetInfo.id, code)
    setAppState((state) => {
      if (!state) {
        return null
      }
      if (curCourseCode === code) {
        return { ...state, preset }
      }
      const { [code]: deleted, ...others } = state.courseData
      return { preset, courseData: others }
    })
  }

  const handleAddCourse = useCallback(async (code: string, filter?: CourseFilter) => {
    if (!presetInfo) {
      return
    }
    const preset = await db.addPresetCourse(presetInfo.id, code, filter)
    setAppState((state) => state && { ...state, preset })
    if (courseData[code]) {
      return
    }
    await fetchCourse(code, false)
  }, [presetInfo, courseData, fetchCourse])

  const handleFilterCourse = useCallback((code: string, filter: CourseFilter) => {
    if (!presetInfo) {
      return
    }
    // Don't use await here because it may cause UI freeze
    db.updatePresetFilters(presetInfo.id, { [code]: filter })
    setAppState((state) => utils.updateAppFilter(state, code, filter))
  }, [presetInfo])

  const classes = useStyles()

  const presetKey = presetInfo
    ? `${presetInfo.id}${presetInfo.program}${presetInfo.acadyear}${presetInfo.semester}`
    : ''

  const courseFinder = !!appState && (
    <CourseFinder
      key={presetKey}
      appState={appState}
      onViewCourse={handleForceViewRenewedCourse}
      onAddCourse={handleAddCourse}
      onDeleteCourse={handleDeleteCourse}
      className={classes.drawerChild}
    />
  )

  const courseDetail = !!appState && (
    <CourseDetail
      key={presetKey}
      code={curCourseCode}
      appState={appState}
      onFilterChange={handleFilterCourse}
      onAddCourse={handleAddCourse}
      onDeleteCourse={handleDeleteCourse}
      className={classes.drawerChild}
    />
  )

  let children = null
  const showWelcome = firstLoaded && !appState

  if (showWelcome) {
    children = (
      <Welcome
        presets={presets}
        onCreatePreset={showDialog.presetCreator}
        onImportPreset={showDialog.presetImporter}
        onShowPresets={showDialog.presetList}
      />
    )
  } else if (firstLoaded && appState) {
    children = (
      <div className={classes.scrollPort}>
        <Container maxWidth={false} className={classes.main}>
          <Switch>
            <Route exact path="/">
              <PresetDetail
                appState={appState}
                onRefresh={fetchCourse}
                onViewCourse={handleForceViewCourse}
                onDeleteCourse={handleDeleteCourse}
                onEditPreset={showDialog.presetEditor}
                onExportPreset={showDialog.presetExporter}
              />
            </Route>
            <Route exact path="/timetable">
              <PlannerTable
                appState={appState}
                onFilterChange={handleFilterCourse}
                onViewCourse={handleViewCourse}
              />
            </Route>
            <Route exact path="/exam">
              <ExamTable
                appState={appState}
                onViewCourse={handleViewCourse}
              />
            </Route>
            <Route path="*">
              <Redirect to="/" />
            </Route>
          </Switch>
        </Container>
        <Hidden lgUp>
          <DrawerWithHeader
            variant="temporary"
            anchor="right"
            open={showCourseFinder}
            onClose={() => setShowCourseFinder(false)}
            PaperProps={{ className: classes.courseFinderPaper }}
            ModalProps={{ keepMounted: true }}
          >
            <Container maxWidth={false}>
              {courseFinder}
            </Container>
          </DrawerWithHeader>
          <DrawerWithHeader
            variant="temporary"
            anchor="right"
            open={!!curCourseCode}
            onClose={handleDeselectCourse}
            PaperProps={{ className: classes.courseDetailPaper }}
          >
            <Container maxWidth={false}>
              {courseDetail}
            </Container>
          </DrawerWithHeader>
        </Hidden>
        <Hidden mdDown>
          <DrawerWithHeader
            variant="temporary"
            anchor="left"
            open={showCourseFinder}
            onClose={() => setShowCourseFinder(false)}
            className={classes.courseFinderDrawer}
            PaperProps={{ className: classes.courseFinderPaper }}
            ModalProps={{
              keepMounted: true,
              hideBackdrop: true,
              disableEnforceFocus: true,
            }}
          >
            <Container maxWidth={false}>
              {courseFinder}
            </Container>
          </DrawerWithHeader>
        </Hidden>
      </div>
    )
  }

  return (
    <>
      <CssBaseline />
      <LoadingSnackbar message={loadingMessage} />
      <MainAppBar
        sidebar={(
          <Container maxWidth={false} className={classes.sidebarContainer}>
            {courseDetail}
          </Container>
        )}
        showSidebar={showSidebar && !!appState}
        onMenuClick={() => setShowNav(true)}
        onFindCourse={() => setShowCourseFinder(true)}
        onShowPresets={showDialog.presetList}
        onSidebarStateChange={setShowSidebar}
        disableActions={!appState}
      >
        {children}
      </MainAppBar>
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
      <DialogManager
        dialog={dialog}
        presets={presets}
        appState={appState}
        onClose={closeDialog}
        onSwitchDialog={showDialog}
        onSelectPreset={loadPreset}
        onPresetUpdated={handlePresetUpdated}
      />
    </>
  )
}

export default App
