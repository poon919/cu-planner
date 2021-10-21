import React from 'react';
import { addDecorator } from '@storybook/react';
import { ThemeProvider } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import CssBaseline from '@material-ui/core/CssBaseline'

import theme from '../src/theme'

addDecorator(storyFn => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Container maxWidth={false} style={{ height: '100vh' }}>{storyFn()}</Container>
  </ThemeProvider>
));
