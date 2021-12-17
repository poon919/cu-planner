import React, { useState, useEffect, useCallback } from 'react'
import {
  Switch,
  Route,
  Redirect,
  useHistory,
  useRouteMatch,
} from 'react-router-dom'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import Container from '@material-ui/core/Container'
import Hidden from '@material-ui/core/Hidden'
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks'
import ScheduleIcon from '@material-ui/icons/Schedule'
import DateRangeIcon from '@material-ui/icons/DateRange'

import * as api from './api'
import * as db from './db'
import * as rd from './reducers'
import * as sels from './selectors'
import {
  AppState,
  PresetInfo,
  CourseFilter,
} from './models'
import { useDesktop } from './hooks'
import LoadingSnackbar from './components/LoadingSnackbar'
import DrawerWithHeader from './components/DrawerWithHeader'
import MainAppBar from './views/MainAppBar'
import PresetDetail from './views/PresetDetail'
import PlannerTable from './views/PlannerTable'
import ExamTable from './views/ExamTable'
import CourseFinder from './views/CourseFinder'
import CourseDetail from './views/CourseDetail'
import Welcome from './views/Welcome'
import DialogManager, {
  useDialog,
  PresetUpdateAction,
} from './views/DialogManager'

const routes = [
  {
    key: 'courses',
    path: '/courses',
    icon: LibraryBooksIcon,
    text: { primary: 'Courses' },
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
const findCourseRoute = '/find'

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
  main: {
    [theme.breakpoints.up('desktop')]: {
      paddingRight: theme.spacing(1.5),
    },
  },
  sidebarContainer: {
    paddingLeft: theme.spacing(1.5),
  },
  hidden: {
    display: 'none',
  },
  courseDetailPaper: {
    [theme.breakpoints.up('sm')]: {
      width: '80%',
    },
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
  },
  drawerChild: {
    paddingTop: theme.spacing(1),
  },
}))

const App = () => {
  const history = useHistory()
  const showCourseFinder = !!useRouteMatch({ path: findCourseRoute, strict: true })
  const [firstLoaded, setFirstLoaded] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('Initializing...')
  const [presets, fetchPresets] = usePresets()
  const [appState, setAppState] = useState<AppState | null>(null)
  const onDesktop = useDesktop()
  const {
    dialog,
    showDialog,
    closeDialog,
  } = useDialog()

  const presetInfo = appState ? sels.selectPresetInfo(appState.preset) : null
  const courseCodes = appState ? sels.selectCourseCodes(appState) : null

  const fetchCourse = async (preset: PresetInfo, code: string, renew: boolean) => {
    setAppState((state) => rd.setCourseData(state, code, { type: 'fetching' }, preset))
    const result = await api.fetchCourse(preset, code, renew)
    setAppState((state) => rd.setCourseData(state, code, result, preset))
  }

  const loadPreset = async (id: number) => {
    const preset = await db.getPreset(id)
    if (!preset) {
      setAppState(null)
      return
    }

    db.setLastPresetID(id)
    setAppState({
      preset,
      viewCourseCode: '',
      courseData: {},
    })
    closeDialog()
  }

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
    if (!appState) {
      return
    }
    const codes = new Set(courseCodes)

    Object.keys(appState.courseData).forEach((code) => {
      if (!codes.delete(code)) {
        setAppState((state) => rd.deleteCourseData(state, code))
      }
    })

    codes.forEach((code) => {
      fetchCourse(appState.preset, code, true)
    })
  }, [courseCodes])

  const handleRoute = (path: string) => {
    history.push(path)
  }

  const handleFindCourseClick = () => {
    history.push(findCourseRoute)
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

  const handleViewCourse = (code: string) => {
    setAppState((state) => rd.viewCourse(state, code))
  }

  const handleViewRenewedCourse = useCallback((code: string) => {
    if (!presetInfo) {
      return
    }
    handleViewCourse(code)
    fetchCourse(presetInfo, code, true)
  }, [presetInfo])

  const handleDeselectCourse = () => {
    setAppState((state) => rd.viewCourse(state, ''))
  }

  const handleDeleteCourse = async (code: string) => {
    if (!presetInfo) {
      return
    }
    const preset = await db.deletePresetCourse(presetInfo.id, code)
    setAppState((state) => rd.setPreset(state, preset))
  }

  const handleAddCourse = useCallback(async (code: string, filter?: CourseFilter) => {
    if (!presetInfo) {
      return
    }
    const preset = await db.addPresetCourse(presetInfo.id, code, filter)
    setAppState((state) => state && { ...state, preset })
  }, [presetInfo])

  const handleRefreshAll = () => {
    if (!appState) {
      return
    }
    appState.preset.courses.forEach((code) => fetchCourse(appState.preset, code, true))
  }

  const handleFilterCourse = useCallback((code: string, filter: CourseFilter) => {
    if (!presetInfo) {
      return
    }
    // Don't use await here because it may cause UI freeze
    db.updatePresetFilters(presetInfo.id, { [code]: filter })
    setAppState((state) => rd.updateAppFilter(state, code, filter))
  }, [presetInfo])

  const classes = useStyles()

  const presetKey = presetInfo
    ? `${presetInfo.id}${presetInfo.program}${presetInfo.acadyear}${presetInfo.semester}`
    : ''

  const courseDetail = !!appState && (
    <CourseDetail
      key={presetKey}
      code={appState.viewCourseCode}
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
            <Route path="/courses">
              <PresetDetail
                appState={appState}
                onRefreshAll={handleRefreshAll}
                onViewCourse={handleViewCourse}
                onDeleteCourse={handleDeleteCourse}
                onEditPreset={showDialog.presetEditor}
                onExportPreset={showDialog.presetExporter}
              />
            </Route>
            <Route path="/timetable">
              <PlannerTable
                appState={appState}
                onFilterChange={handleFilterCourse}
                onViewCourse={handleViewCourse}
              />
            </Route>
            <Route path="/exam">
              <ExamTable
                appState={appState}
                onViewCourse={handleViewCourse}
              />
            </Route>
            <Route path={findCourseRoute} />
            <Route path="*">
              <Redirect to="/courses" />
            </Route>
          </Switch>
          <CourseFinder
            key={presetKey}
            appState={appState}
            onViewCourse={handleViewRenewedCourse}
            onAddCourse={handleAddCourse}
            onDeleteCourse={handleDeleteCourse}
            className={clsx({ [classes.hidden]: !showCourseFinder })}
          />
        </Container>
        <Hidden lgUp>
          <DrawerWithHeader
            variant="temporary"
            anchor="right"
            open={!!appState.viewCourseCode}
            onClose={handleDeselectCourse}
            PaperProps={{ className: classes.courseDetailPaper }}
          >
            <Container maxWidth={false}>
              {courseDetail}
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
        showSidebar={onDesktop && !!appState}
        routes={routes}
        onRoute={handleRoute}
        onFindCourseClick={handleFindCourseClick}
        onShowPresetsClick={showDialog.presetList}
        disableActions={!appState}
      >
        {children}
      </MainAppBar>
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
