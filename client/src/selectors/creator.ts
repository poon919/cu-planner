export const createSelectorMappingMemo = <T extends (...args: any) => any>(
  selectorCreator: () => T,
  key: (...args: Parameters<T>) => string,
  size: number,
): (...args: Parameters<T>) => ReturnType<T> => {
  const memo = new Map<string, T>()

  return (...args) => {
    let selector = memo.get(key(...args))
    if (!selector) {
      selector = selectorCreator()
    }

    // Re-insert selector at the end of the Map
    // to prevent recently used selectors to be deleted
    memo.delete(key(...args))
    memo.set(key(...args), selector)

    const first = (memo.keys().next().value) as string | undefined
    if (memo.size > size && first !== undefined) {
      memo.delete(first)
    }
    return selector(...args)
  }
}
