import { PaperProps } from '@material-ui/core/Paper'

import { TableRowProps } from '../TableRow'

export interface TableEvent {
  id: React.Key
  start: Date
  end: Date
  text?: string
}

type EventCallback<
  T extends TableEvent,
  F extends ((...args: any) => void) | undefined
> = F extends (...args: any) => void
  ? (tableEvent: T, ...args: Parameters<F>) => ReturnType<F>
  : undefined

export interface EventCellProps<T extends TableEvent> extends PaperProps {
  event: T
}

export interface EventRowProps<T extends TableEvent> extends TableRowProps {
  rowHeight: string
  events: T[]
  cellComponent: React.ComponentType<EventCellProps<T>>
  onEventClick?: EventCallback<T, EventCellProps<T>['onClick']>
  onEventDoubleClick?: EventCallback<T, EventCellProps<T>['onDoubleClick']>
}
