import { CourseInfo } from '../models'

const reduceSortedNoDup = (arr1: CourseInfo[], arr2: CourseInfo[]) => {
  if (arr1.length === 0) {
    return arr2
  }
  if (arr2.length === 0) {
    return arr1
  }

  const acc: CourseInfo[] = []
  let i = 0
  let j = 0
  while (i < arr1.length && j < arr2.length) {
    if (arr1[i].code === arr2[j].code) {
      acc.push(arr1[i++])
      j++
    } else if (arr1[i].code < arr2[j].code) {
      acc.push(arr1[i++])
    } else {
      acc.push(arr2[j++])
    }
  }

  while (i < arr1.length) {
    if (arr1[i].code !== acc[acc.length - 1].code) {
      acc.push(arr1[i++])
    }
  }
  while (j < arr2.length) {
    if (arr2[j].code !== acc[acc.length - 1].code) {
      acc.push(arr2[j++])
    }
  }
  return acc
}

// ref: https://leetcode.com/problems/merge-k-sorted-lists/solution/
export const mergeSortedCourses = (arrs: CourseInfo[][]) => {
  const copy = [...arrs]
  const len = copy.length
  if (len === 0) {
    return []
  }

  let interval = 1
  while (interval < len) {
    for (let i = 0; i < len - interval; i += interval * 2) {
      copy[i] = reduceSortedNoDup(copy[i], copy[i + interval])
    }
    interval *= 2
  }
  return copy[0]
}
