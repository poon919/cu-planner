import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import IconButton from '@material-ui/core/IconButton'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'

import Header from './Header'

const useStyles = makeStyles({
  scrollPort: {
    height: '100%',
    position: 'relative',
    overflowY: 'auto',
  },
  header: {
    padding: 0,
  },
})

interface DrawerWithHeaderProps extends React.ComponentPropsWithoutRef<typeof Drawer> {
  anchor: 'left' | 'right'
  onClose: () => void
}

const DrawerWithHeader = ({
  title,
  anchor,
  onClose,
  children,
  ...props
}: DrawerWithHeaderProps) => {
  const classes = useStyles()

  const closeButton = (
    <IconButton
      aria-label="close-drawer"
      title="Close"
      onClick={onClose}
    >
      <ChevronLeftIcon />
    </IconButton>
  )

  return (
    <Drawer anchor={anchor} onClose={onClose} {...props}>
      <Header
        leftAction={anchor === 'right' && closeButton}
        rightAction={anchor === 'left' && closeButton}
        ToolbarProps={{
          className: classes.header,
        }}
      >
        <div className={classes.scrollPort}>
          {children}
        </div>
      </Header>
    </Drawer>
  )
}

export default DrawerWithHeader
