import {
  SectionSpan as SectionSpan_,
  isSpanOverlap,
} from '../../utils'

export type SectionSpan = SectionSpan_

export const anySpanOverlap = (s1: SectionSpan[], s2: SectionSpan[]) => {
  let i = 0
  let j = 0
  while (i < s1.length && j < s2.length) {
    const span1 = s1[i]
    const span2 = s2[j]
    if (isSpanOverlap(span1, span2)) {
      return true
    }
    if (span1[0] < span2[0]) {
      i++
    } else {
      j++
    }
  }
  return false
}

export const isSpansEqual = (s1: SectionSpan[], s2: SectionSpan[]) => {
  if (s1.length !== s2.length) {
    return false
  }
  for (let i = 0; i < s1.length; i++) {
    const [start1, end1] = s1[i]
    const [start2, end2] = s2[i]
    if (start1 !== start2 || end1 !== end2) {
      return false
    }
  }
  return true
}
