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
