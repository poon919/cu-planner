export interface ContextProps {
  startHour: number
  endHour: number
  rowHeaderWidth: string
  colMinWidth: string
}

export interface TimetableProps extends ContextProps, React.ComponentPropsWithoutRef<'div'> {
  tableProps?: React.ComponentPropsWithoutRef<'div'>
}
