import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

interface CommonProps {
  key: string
  text: React.ComponentPropsWithoutRef<typeof ListItemText>
  icon?: React.ComponentType<{}>
  header?: string
  ListItemProps?: Omit<React.ComponentPropsWithoutRef<typeof ListItem>, 'button'>
}

export interface Route extends CommonProps {
  path: string
}

export interface NestedRoute extends CommonProps {
  children: Route[]
}

export type RouteItem = Route | NestedRoute

export interface RouteListProps {
  routes: RouteItem[]
  onRoute: (path: string) => void
}
