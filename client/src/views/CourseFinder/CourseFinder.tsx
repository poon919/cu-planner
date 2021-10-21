import React, { useState, useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import IconButton from '@material-ui/core/IconButton'
import SearchIcon from '@material-ui/icons/Search'
import AlertTitle from '@material-ui/lab/AlertTitle'

import * as api from '../../api'
import { onFocusSelectTextHandler } from '../../utils'
import { AppState, CourseListFetchState } from '../../models'
import { selectPresetInfo } from '../../selectors'
import LargeAlert from '../../components/LargeAlert'
import Tips from '../../components/Tips'
import ListItemSkeleton from '../../components/ListItemSkeleton'
import QueryResultList from './List'
import { CourseFinderProps } from './interfaces'

export interface Query {
  code: string
  shortname: string
}

const parseQuery = (query: string): Query => {
  const queries = query.trim().split(' ')
  let matches = null
  // Try to find course code in the first part of string
  matches = /^\d+$/.exec(queries[0])
  if (matches) {
    return { code: matches[0], shortname: queries.slice(1).join(' ') }
  }
  // Try to find course code in the last part of string
  matches = /^\d+$/.exec(queries[queries.length - 1])
  if (matches) {
    return { code: matches[0], shortname: queries.slice(0, -1).join(' ') }
  }
  return { code: '', shortname: query.trim() }
}

const parseQueries = (queries: string): Query[] => queries
  .split(',')
  .map((query) => parseQuery(query))

const validateQuery = (code: string, shortname: string) => {
  if (code.length < 2 && shortname.length < 2) {
    return 'Required at least 2 characters of course code or name.'
  }
  return ''
}

const FindingTips = () => (
  <Tips>
    <AlertTitle><b>Tips</b></AlertTitle>
    <Typography>You can find a course by...</Typography>
    <ul>
      <li>
        <Typography>
          <b>code </b>
          - 0201, 5500
        </Typography>
      </li>
      <li>
        <Typography>
          <b>name </b>
          - exp eng, intro
        </Typography>
      </li>
      <li>
        <Typography>
          <b>both </b>
          - 23 strategy, 02 idea
        </Typography>
      </li>
    </ul>
  </Tips>
)

const useStyles = makeStyles((theme) => ({
  searchBar: {
    position: 'sticky',
    top: '0px',
    left: '0px',
    zIndex: 2,
    backgroundColor: theme.palette.background.default,
    paddingBottom: theme.spacing(1),
    margin: 0,
  },
}))

export interface PureCourseFinderProps extends Omit<CourseFinderProps, 'appState'> {
  result?: CourseListFetchState
  addedCourses: string[]
  courseData: AppState['courseData']
  onSubmitQueries: (queries: Query[]) => void
}

export const PureCourseFinder = React.memo(({
  result,
  addedCourses,
  courseData,
  onViewCourse,
  onAddCourse,
  onDeleteCourse,
  onSubmitQueries,
  ...props
}: PureCourseFinderProps) => {
  const [queryText, setQueryText] = useState('')
  const [errText, setErrText] = useState('')

  const finding = result?.type === 'fetching'
  const submittable = queryText !== '' && errText === '' && !finding

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    const err = parseQueries(value).reduceRight(
      (acc, { code, shortname }) => acc || validateQuery(code, shortname),
      '',
    )
    setErrText(err)
    setQueryText(value)
  }

  const handleSubmit = () => {
    if (!submittable) {
      return
    }
    onSubmitQueries(parseQueries(queryText))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  const classes = useStyles()

  const findButton = (
    <InputAdornment position="end">
      <IconButton
        edge="end"
        aria-label="find-a-course"
        title="Find"
        onClick={handleSubmit}
        disabled={!submittable}
      >
        <SearchIcon />
      </IconButton>
    </InputAdornment>
  )

  let children: null | JSX.Element = null

  if (!result) {
    children = <FindingTips />
  } else if (result.type === 'fetching') {
    children = <ListItemSkeleton count={5} />
  } else if (result.type === 'error') {
    children = (
      <LargeAlert
        severity="error"
        title={result.message}
        borderless
      />
    )
  } else if (result.data.length === 0) {
    children = (
      <LargeAlert
        severity="info"
        title="Not found"
        borderless
      />
    )
  } else {
    children = (
      <QueryResultList
        result={result.data}
        addedCourses={addedCourses}
        courseData={courseData}
        onViewCourse={onViewCourse}
        onAddCourse={onAddCourse}
        onDeleteCourse={onDeleteCourse}
      />
    )
  }

  return (
    <div {...props}>
      <TextField
        fullWidth
        margin="dense"
        variant="outlined"
        autoComplete="off"
        name="query"
        placeholder="Find a course..."
        value={queryText}
        error={errText !== ''}
        helperText={errText}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={onFocusSelectTextHandler}
        className={classes.searchBar}
        disabled={finding}
        InputProps={{ endAdornment: findButton }}
      />
      {children}
    </div>
  )
})

export default ({
  appState,
  ...props
}: CourseFinderProps) => {
  const pInfo = selectPresetInfo(appState.preset)
  const [result, setResult] = useState<CourseListFetchState>()

  const handleSubmit = useCallback(async (queries: Query[]) => {
    setResult({ type: 'fetching' })
    setResult(await api.fetchMultiCourseLists(pInfo, queries))
  }, [pInfo])

  return (
    <PureCourseFinder
      addedCourses={appState.preset.courses}
      courseData={appState.courseData}
      result={result}
      onSubmitQueries={handleSubmit}
      {...props}
    />
  )
}
