import React from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import Skeleton from '@material-ui/lab/Skeleton'

import { range } from '../utils'

const useStyles = makeStyles((theme) => ({
  item: {
    margin: theme.spacing(1, 0),
    height: '2rem',
  },
}))

export interface ListItemSkeletonProps<T extends React.ElementType<any> = 'div'> extends
  React.ComponentPropsWithoutRef<typeof Skeleton> {
  count: number
  component: T
  rootProps?: React.ComponentPropsWithoutRef<T>
}

const ListItemSkeleton = ({
  count,
  component: Component,
  rootProps,
  className,
  ...props
}: ListItemSkeletonProps) => {
  const classes = useStyles()

  const items: JSX.Element[] = range(0, count, (i) => (
    <Skeleton
      key={i}
      variant="rect"
      className={clsx(classes.item, className)}
      {...props}
    />
  ))

  return (
    <Component {...rootProps}>
      {items}
    </Component>
  )
}

ListItemSkeleton.defaultProps = {
  component: 'div',
}

export default ListItemSkeleton
