import { CourseFilter } from '../../models'
import { onFocusSelectTextHandler } from '../../utils'
import { createForm } from './form'

const defaultFormValues: CourseFilter = {
  section: '',
  keyword: '',
}

const { useForm, createTextField } = createForm(defaultFormValues)

const SectionField = createTextField({
  name: 'section',
  label: 'Section',
  placeholder: '1, 3-4, 9-11',
  fullWidth: true,
  autoComplete: 'off',
  onFocus: onFocusSelectTextHandler,
})

const KeywordField = createTextField({
  name: 'keyword',
  label: 'Keyword',
  placeholder: 'MO, STAFF, GENED',
  fullWidth: true,
  autoComplete: 'off',
  onFocus: onFocusSelectTextHandler,
})

export { useForm }

export default {
  SectionField,
  KeywordField,
}
