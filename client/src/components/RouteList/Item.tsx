import React from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'

const useStyles = makeStyles((theme) => ({
  nested: {
    paddingLeft: theme.spacing(4),
  },
}))

export interface RouteLinkProps extends Omit<React.ComponentPropsWithoutRef<typeof ListItem>, 'button'> {
  text: React.ComponentPropsWithoutRef<typeof ListItemText>
  icon?: React.ComponentType<{}>
  nested: boolean
}

const RouteLink = ({
  text,
  icon: Icon,
  nested,
  className,
  ...props
}: RouteLinkProps) => {
  const classes = useStyles()

  return (
    <ListItem
      button
      className={clsx({ [classes.nested]: nested }, className)}
      {...props}
    >
      {Icon
        ? <ListItemIcon><Icon /></ListItemIcon>
        : null}
      <ListItemText {...text} />
    </ListItem>
  )
}

RouteLink.defaultProps = {
  nested: false,
}

export default RouteLink
