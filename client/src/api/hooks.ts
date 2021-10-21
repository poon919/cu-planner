import { useState, useEffect } from 'react'

import { fetchValidSemesters } from './api'

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
