import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import AlertTitle from '@material-ui/lab/AlertTitle'

import Tips from '../components/Tips'

export default {
  component: Tips,
  title: 'Tips',
}

const useStyles = makeStyles((theme) => ({
  tips: {
    margin: theme.spacing(1, 0),
  },
}))

export const Default = () => {
  const classes = useStyles()

  return (
    <>
      <Tips className={classes.tips} />
      <Tips className={classes.tips}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua
      </Tips>
      <Tips className={classes.tips}>
        <AlertTitle>Tips</AlertTitle>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua. Rhoncus dolor purus non enim praesent elementum
        facilisis leo vel. Risus at ultrices mi tempus imperdiet. Semper risus in hendrerit
      </Tips>
    </>
  )
}
