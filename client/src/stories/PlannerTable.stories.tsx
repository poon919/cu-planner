import React from 'react'
import { actions } from '@storybook/addon-actions'

import PlannerTable from '../views/PlannerTable'
import { EmptyAppState, TestAppState } from './story.data'

export default {
  component: PlannerTable,
  title: 'PlannerTable',
}

const props = actions('onViewCourse', 'onFilterChange')

export const Empty = () => <PlannerTable appState={EmptyAppState} {...props} />

export const WithData = () => <PlannerTable appState={TestAppState} {...props} />
