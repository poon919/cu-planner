import React from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Typography, { TypographyProps } from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'

const useStyles = makeStyles((theme) => ({
  colorBox: {
    alignSelf: 'stretch',
    width: theme.spacing(1),
    margin: theme.spacing(0, 1, 0, 0),
  },
  loadingText: {
    animation: theme.animations.blinker,
  },
}))

export interface CourseListItemProps extends React.ComponentPropsWithoutRef<typeof ListItem> {
  color: string
  primary: string
  secondary?: string
  error?: boolean
  loading?: boolean
  onDelete: () => void
}

export const CourseListItem = ({
  color,
  primary,
  secondary,
  error,
  loading,
  onDelete,
  ...props
}: CourseListItemProps) => {
  let textColor: TypographyProps['color'] = 'textPrimary'
  if (loading) {
    textColor = 'textSecondary'
  } else if (error) {
    textColor = 'error'
  }

  const classes = useStyles()

  return (
    <ListItem {...props}>
      <div className={classes.colorBox} style={{ backgroundColor: color }} />
      <ListItemText disableTypography>
        {secondary && (
          <Typography
            variant="body2"
            color="textSecondary"
          >
            {secondary}
          </Typography>
        )}
        <Typography
          variant="body1"
          color={textColor}
          className={clsx({
            [classes.loadingText]: loading,
          })}
        >
          {primary}
        </Typography>
      </ListItemText>
      <ListItemSecondaryAction>
        <IconButton
          edge="end"
          aria-label="remove-course"
          title="Remove"
          onClick={onDelete}
        >
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  )
}

export default CourseListItem
