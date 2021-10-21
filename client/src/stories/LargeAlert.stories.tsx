import React from 'react'

import LargeAlert, { LargeAlertProps } from '../components/LargeAlert'

export default {
  component: LargeAlert,
  title: 'LargeAlert',
}

export const Default = () => (
  <>
    {['none', 'success', 'info', 'warning', 'error'].map((variant) => (
      <LargeAlert
        key={variant}
        severity={variant as LargeAlertProps['severity']}
        title="Lorem ipsum dolor sit amet, consectetur adipiscing elit"
        style={{ marginBottom: 4 }}
      >
        sed do eiusmod tempor incididuntut labore et dolore magna aliqua.
      </LargeAlert>
    ))}
  </>
)

export const Borderless = () => (
  <>
    {['none', 'success', 'info', 'warning', 'error'].map((variant) => (
      <LargeAlert
        key={variant}
        severity={variant as LargeAlertProps['severity']}
        title="Lorem ipsum dolor sit amet, consectetur adipiscing elit"
        style={{ marginBottom: 4 }}
        borderless
      >
        sed do eiusmod tempor incididuntut labore et dolore magna aliqua.
      </LargeAlert>
    ))}
  </>
)
