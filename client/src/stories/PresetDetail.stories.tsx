import React, { useState } from 'react'
import { action, actions } from '@storybook/addon-actions'

import { AppState } from '../models'
import PresetDetail from '../views/PresetDetail/PresetDetail'
import { EmptyAppState, TestAppState } from './story.data'

export default {
  component: PresetDetail,
  title: 'PresetDetail',
}

const useCommonProps = (initState: AppState) => {
  const [appState, setAppState] = useState(initState)

  const handleDeleteCourse = (code: string) => {
    action('onDeleteCourse')(code)
    setAppState((state) => ({
      ...state,
      preset: {
        ...state.preset,
        courses: state.preset.courses.filter((c) => c !== code),
      },
    }))
  }

  return {
    appState,
    onDeleteCourse: handleDeleteCourse,
    ...actions('onRefresh', 'onViewCourse', 'onEditPreset', 'onExportPreset'),
  }
}

export const Empty = () => {
  const props = useCommonProps(EmptyAppState)

  return <PresetDetail {...props} />
}

export const WithData = () => {
  const props = useCommonProps(TestAppState)

  return <PresetDetail {...props} />
}
