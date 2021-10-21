import React from 'react'
import { actions } from '@storybook/addon-actions'

import ExamTable from '../views/ExamTable'
import { EmptyAppState, TestAppState } from './story.data'

export default {
  component: ExamTable,
  title: 'ExamTable',
}

const props = actions('onViewCourse')

export const Empty = () => <ExamTable appState={EmptyAppState} {...props} />

export const WithData = () => <ExamTable appState={TestAppState} {...props} />
