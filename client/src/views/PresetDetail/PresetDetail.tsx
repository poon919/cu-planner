import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import SvgIcon from '@material-ui/core/SvgIcon'
import EditIcon from '@material-ui/icons/Edit'
import RefreshIcon from '@material-ui/icons/Refresh'

import { selectPresetInfo, isFetching, selectCourseColor } from '../../selectors'
import { toDateString, parseProgram, parseSemester } from '../../utils'
import LargeAlert from '../../components/LargeAlert'
import { CourseList, CourseListItem } from '../../components/CourseList'
import { PresetDetailProps } from './interfaces'

// svg path taken from https://materialdesignicons.com/icon/export-variant
const ExportIcon = () => (
  <SvgIcon>
    <path
      fill="currentColor"
      d="M12,1L8,5H11V14H13V5H16M18,23H6C4.89,23 4,22.1 4,21V9A2,2 0 0,1 6,7H9V9H6V21H18V9H15V7H18A2,2 0 0,1 20,9V21A2,2 0 0,1 18,23Z"
    />
  </SvgIcon>
)

const useStyles = makeStyles((theme) => ({
  presetInfo: {
    padding: theme.spacing(0, 0, 1),
    borderBottom: `1px solid ${theme.palette.divider}`,
    '& > div': {
      width: 'auto',
    },
  },
  bottomAligned: {
    display: 'flex',
    alignItems: 'center',
  },
}))

const PresetDetail = ({
  appState,
  onRefreshAll,
  onViewCourse,
  onDeleteCourse,
  onEditPreset,
  onExportPreset,
}: PresetDetailProps) => {
  const {
    name,
    program,
    acadyear,
    semester,
    courses,
  } = appState.preset
  const fetching = isFetching(appState)

  const [totalCredits, updated] = courses.reduce((acc, code) => {
    const result = appState.courseData[code]
    if (result?.type === 'success') {
      const { data, timestamp } = result
      return [acc[0] + data.totalCredit, Math.min(acc[1], timestamp.getTime())]
    }
    return acc
  }, [0, Number.MAX_VALUE] as [number, number])

  const classes = useStyles()

  return (
    <>
      <div>
        <Grid container wrap="nowrap" justify="space-between" alignItems="center" className={classes.presetInfo}>
          <Grid container wrap="nowrap" alignItems="center">
            <div>
              <Typography variant="h6">
                {name}
              </Typography>
              <Typography color="textSecondary">
                {`${parseSemester(program, semester)} ${parseProgram(program)} ${acadyear}`}
              </Typography>
            </div>
          </Grid>
          <Grid container justify="flex-end">
            <IconButton
              aria-label="export-preset"
              title="Export preset"
              disabled={fetching}
              onClick={() => onExportPreset(appState.preset)}
            >
              <ExportIcon />
            </IconButton>
            <IconButton
              aria-label="edit-preset"
              title="Edit preset"
              onClick={() => onEditPreset(selectPresetInfo(appState.preset))}
            >
              <EditIcon />
            </IconButton>
          </Grid>
        </Grid>
        <Grid
          container
          justify="space-between"
          alignItems="center"
        >
          <Typography component="span" variant="body2">{`Credit: ${totalCredits}`}</Typography>
          <div className={classes.bottomAligned}>
            <Typography component="span" variant="body2">
              {`Updated: ${updated === Number.MAX_VALUE ? 'N/A' : toDateString(new Date(updated))}`}
            </Typography>
            <IconButton
              aria-label="refresh-courses"
              title="Refresh all courses"
              onClick={onRefreshAll}
            >
              <RefreshIcon fontSize="small" />
            </IconButton>
          </div>
        </Grid>
        {courses.length > 0
          ? (
            <CourseList disablePadding>
              {courses.map((code) => {
                const result = appState.courseData[code]
                const color = selectCourseColor(appState.preset, code)
                let text = 'Loading...'
                if (result?.type === 'error') {
                  text = result.message
                } else if (result?.type === 'success') {
                  text = result.data.shortname
                }

                return (
                  <CourseListItem
                    button
                    divider
                    disableGutters
                    key={code}
                    color={color}
                    primary={text}
                    secondary={code}
                    loading={!result || result.type === 'fetching'}
                    error={result?.type === 'error'}
                    onClick={() => onViewCourse(code)}
                    onDelete={() => onDeleteCourse(code)}
                  />
                )
              })}
            </CourseList>
          )
          : (
            <LargeAlert
              severity="info"
              title="No courses"
              height={220}
              borderless
            />
          )}
      </div>
    </>
  )
}

export default PresetDetail
