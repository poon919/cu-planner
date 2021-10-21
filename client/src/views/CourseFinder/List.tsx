import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import CircularProgress from '@material-ui/core/CircularProgress'
import IconButton from '@material-ui/core/IconButton'
import AddIcon from '@material-ui/icons/Add'
import CheckIcon from '@material-ui/icons/Check'

import { CourseInfo, AppState } from '../../models'

const useStyles = makeStyles((theme) => ({
  added: {
    color: theme.palette.success.main,
  },
}))

export interface QueryResultListProps {
  result: CourseInfo[]
  addedCourses: string[]
  courseData: AppState['courseData']
  onViewCourse: (code: string) => void
  onAddCourse: (code: string) => void
  onDeleteCourse: (code: string) => void
}

const QueryResultList = ({
  result,
  addedCourses,
  courseData,
  onViewCourse,
  onAddCourse,
  onDeleteCourse,
}: QueryResultListProps) => {
  const addedCoursesSet = new Set(addedCourses)

  const classes = useStyles()

  return (
    <List component="div" disablePadding>
      {result.map((course) => {
        const { code, shortname } = course
        const isLoading = courseData[code]?.type === 'fetching'

        const icon = addedCoursesSet.has(code)
          ? (
            <IconButton
              edge="end"
              aria-label="add"
              color="primary"
              onClick={() => onDeleteCourse(code)}
            >
              <CheckIcon className={classes.added} />
            </IconButton>
          )
          : (
            <IconButton
              edge="end"
              aria-label="add"
              color="primary"
              onClick={() => onAddCourse(code)}
            >
              <AddIcon />
            </IconButton>
          )

        return (
          <ListItem
            key={code}
            button
            divider
            onClick={() => onViewCourse(code)}
            disabled={isLoading}
          >
            <ListItemText
              primary={`${code} ${shortname}`}
            />
            <ListItemSecondaryAction>
              {isLoading
                ? <CircularProgress style={{ width: '20px', height: '20px' }} />
                : icon}
            </ListItemSecondaryAction>
          </ListItem>
        )
      })}
    </List>
  )
}

export default QueryResultList
