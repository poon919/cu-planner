export interface TableRowProps extends React.ComponentPropsWithoutRef<'div'> {
  header?: string
  contentProps?: React.ComponentPropsWithoutRef<'div'>
  borderless?: boolean
}
