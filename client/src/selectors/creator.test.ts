import { createSelector } from 'reselect'

import { createSelectorMappingMemo } from './creator'

describe('Selector creator with memo feature', () => {
  const selectNumber = createSelectorMappingMemo(
    () => createSelector(
      (a: number) => a,
      (a: number) => ({ value: a }),
    ),
    (a) => a.toString(),
    2,
  )
  const num1 = selectNumber(1)
  const num2 = selectNumber(2)

  it('is not the same object', () => {
    expect(num1).not.toBe(num2)
  })

  it('is the same object', () => {
    expect(selectNumber(1)).toBe(num1)
  })

  it('keep key "1" and remove key "2" from the memo', () => {
    selectNumber(3)
    expect(selectNumber(1)).toBe(num1)
    expect(selectNumber(2)).not.toBe(num2)
  })
})
