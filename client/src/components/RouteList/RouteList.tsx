import React, { useState } from 'react'
import List from '@material-ui/core/List'
import ListSubheader from '@material-ui/core/ListSubheader'
import Collapse from '@material-ui/core/Collapse'

import RouteLink from './Item'
import {
  Route,
  NestedRoute,
  RouteListProps,
} from './interfaces'

const isRoute = (item: Route | NestedRoute): item is Route => (
  (item as Route).path !== undefined
)

export const RouteList = ({
  routes,
  onRoute,
}: RouteListProps) => {
  const [selected, setSelected] = useState('')

  const toggleSelected = (key: string) => setSelected((state) => (
    state === key ? '' : key
  ))

  return (
    <List component="nav">
      {routes.map((route) => {
        const {
          key,
          icon,
          text,
          header,
          ListItemProps,
        } = route

        let children: React.ReactNode = null

        if (!isRoute(route)) {
          children = (
            <Collapse in={selected === key} timeout="auto" unmountOnExit>
              <List component="div" disablePadding dense>
                {(route as NestedRoute).children.map((nested) => (
                  <RouteLink
                    key={nested.key}
                    text={nested.text}
                    icon={nested.icon}
                    onClick={() => onRoute(nested.path)}
                    nested
                    {...ListItemProps}
                  />
                ))}
              </List>
            </Collapse>
          )
        }

        return (
          <React.Fragment key={key}>
            {header && <ListSubheader component="div">{header}</ListSubheader>}
            <RouteLink
              key={key}
              text={text}
              icon={icon}
              onClick={isRoute(route)
                ? () => onRoute(route.path)
                : () => toggleSelected(key)}
            />
            {children}
          </React.Fragment>
        )
      })}
    </List>
  )
}

export default RouteList
