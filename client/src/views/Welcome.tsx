import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

import { PresetInfo } from '../models'

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
  },
  container: {
    height: '100%',
  },
  actionContainer: {
    marginTop: theme.spacing(2),
  },
}))

interface WelcomeProps {
  presets: PresetInfo[]
  onCreatePreset: () => void
  onImportPreset: () => void
  onShowPresets: () => void
}

const Welcome = ({
  presets,
  onCreatePreset,
  onImportPreset,
  onShowPresets,
}: WelcomeProps) => {
  const classes = useStyles()

  return (
    <Container maxWidth={false} className={classes.root}>
      <Grid
        container
        direction="column"
        justify="center"
        alignContent="center"
        className={classes.container}
      >
        <Typography color="primary" variant="h1" align="center">
          CU PLANNER
        </Typography>
        <Typography color="primary" variant="h5" align="center">
          A simple way to plan your class schedule
        </Typography>
        <Container maxWidth="sm">
          <Grid
            item
            container
            justify="center"
            alignContent="center"
            spacing={1}
            className={classes.actionContainer}
          >
            {presets.length > 0
              ? (
                <Grid item xs={12}>
                  <Button
                    color="primary"
                    variant="contained"
                    fullWidth
                    onClick={onShowPresets}
                  >
                    CHOOSE PRESET
                  </Button>
                </Grid>
              )
              : (
                <>
                  <Grid item xs={12} sm={6}>
                    <Button
                      color="primary"
                      variant="outlined"
                      fullWidth
                      onClick={onImportPreset}
                    >
                      IMPORT
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Button
                      color="primary"
                      variant="contained"
                      fullWidth
                      onClick={onCreatePreset}
                    >
                      CREATE NEW PRESET
                    </Button>
                  </Grid>
                </>
              )}

          </Grid>
        </Container>
      </Grid>
    </Container>
  )
}

export default Welcome
