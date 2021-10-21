/* eslint react/prop-types: 0 */
import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import MoreVertIcon from '@material-ui/icons/MoreVert'

const PaperProps = {
  style: {
    width: '110px',
  },
}

const useStyles = makeStyles((theme) => ({
  danger: {
    color: theme.palette.error.main,
  },
}))

export interface PresetListItemProps extends React.ComponentPropsWithoutRef<typeof ListItem> {
  primary: string
  secondary?: string
  onEdit: () => void
  onDelete: () => void
}

const PresetListItem = ({
  primary,
  secondary,
  onEdit,
  onDelete,
  ...props
}: PresetListItemProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  const handleShowMenu = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const menuItemHandler = (handler: () => void) => () => {
    handleCloseMenu()
    handler()
  }

  const classes = useStyles()

  return (
    <>
      <ListItem {...props}>
        <ListItemText primary={primary} secondary={secondary} />
        <ListItemSecondaryAction>
          <IconButton onClick={handleShowMenu}>
            <MoreVertIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
      <Menu
        anchorEl={anchorEl}
        open={anchorEl !== null}
        PaperProps={PaperProps}
        anchorOrigin={{
          horizontal: 'right',
          vertical: 'top',
        }}
        transformOrigin={{
          horizontal: 'right',
          vertical: 'top',
        }}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={menuItemHandler(onEdit)}>Edit</MenuItem>
        <MenuItem onClick={menuItemHandler(onDelete)} className={classes.danger}>Delete</MenuItem>
      </Menu>
    </>
  )
}

export default PresetListItem
