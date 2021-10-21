import React from 'react'
import { actions } from '@storybook/addon-actions'

import { CourseListFetchState } from '../models'
import { PureCourseFinder } from '../views/CourseFinder/CourseFinder'
import { Courses, TestAppState } from './story.data'

export default {
  component: PureCourseFinder,
  title: 'CourseFinder',
}

const props = {
  addedCourses: TestAppState.preset.courses,
  courseData: TestAppState.courseData,
  ...actions('onViewCourse', 'onAddCourse', 'onDeleteCourse', 'onSubmitQueries'),
}

const COURSELIST: CourseListFetchState = {
  type: 'success',
  data: [
    ...Courses.map(({ code, shortname }) => ({ code, shortname })),
    ...Array(26).fill(0).map((_, i) => ({
      code: String(i).padStart(7, '0'),
      shortname: String.fromCodePoint(65 + i).repeat(5),
    })),
  ],
  timestamp: new Date(),
}

export const Default = () => <PureCourseFinder {...props} />

export const Loading = () => (
  <PureCourseFinder
    result={{ type: 'fetching' }}
    {...props}
  />
)

export const Error = () => (
  <PureCourseFinder
    result={{ type: 'error', message: 'Lorem ipsum dolor sit amet' }}
    {...props}
  />
)

export const NotFound = () => (
  <PureCourseFinder
    result={{ type: 'success', data: [], timestamp: new Date() }}
    {...props}
  />
)

export const WithData = () => (
  <PureCourseFinder
    result={COURSELIST}
    {...props}
  />
)
