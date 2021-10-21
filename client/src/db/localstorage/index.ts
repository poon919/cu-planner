export const getLastPresetID = () => {
  const id = localStorage.getItem('last-preset-id')
  if (!id) {
    return -1
  }
  return +id
}

export const setLastPresetID = (id: number) => localStorage.setItem('last-preset-id', id.toString())
