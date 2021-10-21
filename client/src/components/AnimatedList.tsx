import React from 'react'
import { TransitionGroup } from 'react-transition-group'
import List, { ListProps } from '@material-ui/core/List'
import Collapse from '@material-ui/core/Collapse'

export interface AnimatedListProps extends ListProps<'div'> {
  transitionComponent: React.ComponentType<any>
}

const AnimatedList = ({
  children,
  transitionComponent: Component,
  ...props
}: AnimatedListProps) => (
  <List component="div" {...props}>
    <TransitionGroup component={null}>
      {React.Children.map(children, (child) => (
        <Component>{child}</Component>
      ))}
    </TransitionGroup>
  </List>
)

AnimatedList.defaultProps = {
  transitionComponent: Collapse,
}

export default AnimatedList
