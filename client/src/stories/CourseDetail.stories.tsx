import React, { useState } from 'react'
import { action } from '@storybook/addon-actions'

import { CourseDetail } from '../views/CourseDetail/CourseDetail'
import { Courses, TestAppState } from './story.data'

export default {
  component: CourseDetail,
  title: 'CourseDetail',
}

const useCommonProps = () => {
  const [appState, setAppState] = useState(TestAppState)

  const handleAddCourse = (code: string) => {
    action('Adding course to preset')(code)
    setAppState((state) => ({
      ...state,
      preset: {
        ...state.preset,
        courses: [...state.preset.courses, code],
      },
    }))
  }

  const handleDeleteCourse = (code: string) => {
    action('Removing course from preset')(code)
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
    onFilterChange: action('onFilterChange'),
    onAddCourse: handleAddCourse,
    onDeleteCourse: handleDeleteCourse,
  }
}

export const Loading = () => {
  const props = useCommonProps()
  const code = TestAppState.preset.courses[TestAppState.preset.courses.length - 3]

  return (
    <CourseDetail
      code={code}
      {...props}
    />
  )
}

export const Error = () => {
  const props = useCommonProps()
  const code = TestAppState.preset.courses[TestAppState.preset.courses.length - 2]

  return (
    <CourseDetail
      code={code}
      {...props}
    />
  )
}

export const Example1 = () => {
  const props = useCommonProps()
  const { code } = Courses[0]

  return (
    <CourseDetail
      code={code}
      {...props}
    />
  )
}

export const Example2 = () => {
  const props = useCommonProps()
  const { code } = Courses[1]

  return (
    <CourseDetail
      code={code}
      {...props}
    />
  )
}
