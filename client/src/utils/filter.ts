export const SEP_CHAR = ','
export const splitFilter = (filter: string) => filter
  .split(SEP_CHAR)
  .map((s) => s.trim().toUpperCase())

export type SectionSpan = [number, number]

export const isSpanOverlap = (s1: SectionSpan, s2: SectionSpan) => s1[0] <= s2[1] && s2[0] <= s1[1]

// ref: https://www.geeksforgeeks.org/merging-intervals/
const mergeSpansInPlace = (spans: SectionSpan[]): SectionSpan[] => {
  if (spans.length === 0) {
    return spans
  }

  spans.sort((a, b) => a[0] - b[0])
  let lastIndex = 0
  for (let i = 1; i < spans.length; i++) {
    const target = spans[lastIndex]
    const span = spans[i]
    if (isSpanOverlap(target, span) || target[1] + 1 === span[0]) {
      target[1] = Math.max(target[1], span[1])
    } else {
      lastIndex += 1
      spans[lastIndex] = span
    }
  }

  return spans.slice(0, lastIndex + 1)
}

const sectionFilterToSpan = (spanString: string): SectionSpan | null => {
  // eslint-disable-next-line prefer-const
  let [x, y] = spanString
    .split('-')
    .map((s) => (s === '' ? undefined : Math.ceil(Math.max(+s, 1))))
  if (x === undefined) {
    return null
  }
  if (y === undefined) {
    y = x
  }
  if (Number.isNaN(x) || Number.isNaN(y)) {
    return null
  }
  return [Math.min(x, y), Math.max(x, y)]
}

export const parseSectionFilter = (sectionFilter: string): SectionSpan[] => {
  const spans = splitFilter(sectionFilter)
    .reduce((acc, filter) => {
      const span = sectionFilterToSpan(filter)
      if (span !== null) {
        acc.push(span)
      }
      return acc
    }, [] as SectionSpan[])
  return mergeSpansInPlace(spans)
}

export const sectionSpansToText = (spans: SectionSpan[]) => spans
  .map(([start, end]) => (
    start === end
      ? start.toString()
      : `${start}-${end}`
  ))
  .join(', ')
