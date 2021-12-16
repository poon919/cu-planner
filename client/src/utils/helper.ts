export const range = <T extends any>(
  start: number,
  end: number,
  callback: (i: number) => T,
): T[] => {
  const result = []
  for (let i = start; i < end; i++) {
    result.push(callback(i))
  }
  return result
}

export const stringifyValues = <T extends object>(o: T) => Object
  .entries(o)
  .reduce((acc, [k, v]) => {
    acc[k as keyof T] = String(v)
    return acc
  }, {} as Record<keyof T, string>)
