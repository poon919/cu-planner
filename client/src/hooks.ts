import { useState, useRef, useEffect } from 'react'
import { Theme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import { fetchValidSemesters } from './api'

// ref: https://usehooks.com/usePrevious/
export const usePrevious = <T>(value: T): T => {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref: any = useRef<T>()
  // Store current value in ref
  useEffect(() => {
    ref.current = value
  }, [value]) // Only re-run if value changes
  // Return previous value (happens before update in useEffect above)
  return ref.current
}

export const useValidSemester = () => {
  const [validSemesters, setValidSemesters] = useState<string[]>()

  useEffect(() => {
    const init = async () => {
      const result = await fetchValidSemesters()
      setValidSemesters(result.type === 'success' ? result.data : undefined)
    }
    init()
  }, [])

  return validSemesters
}

export const useDesktop = () => {
  const onDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('desktop'))
  return onDesktop
}
