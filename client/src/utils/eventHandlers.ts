export const onFocusSelectTextHandler = ({ target }: React.FocusEvent<HTMLInputElement>) => (
  target.setSelectionRange(0, target.value.length)
)
