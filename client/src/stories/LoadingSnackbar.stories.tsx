import React from 'react'

import LoadingSnackbar from '../components/LoadingSnackbar'

export default {
  component: LoadingSnackbar,
  title: 'LoadingSnackbar',
}

export const Default = () => <LoadingSnackbar message="Loading..." />
