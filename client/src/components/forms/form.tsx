import React, { useState } from 'react'
import clsx from 'clsx'
import MuiTextField, { TextFieldProps as MuiTextFieldProps } from '@material-ui/core/TextField'

type FormValues = object
type FormErrors<T extends FormValues> = Partial<Record<keyof T, string | false>>

export interface CreateUseFormOptions<T extends FormValues> {
  validator?: (values: T) => FormErrors<T>
}

export interface UseManagedFormProps<T extends FormValues> {
  defaultValues?: T
  onChange?: (e: React.ChangeEvent<HTMLInputElement>, values: T) => void
}

export interface UseFormProps<T extends FormValues> {
  values?: T
  onChange: (e: React.ChangeEvent<HTMLInputElement>, values: T) => void
}

interface Form<T extends FormValues> {
  values: T
  errors: FormErrors<T>
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

// TODO: React complains an type error on 'variant' property. This may be a bug ?
type OmittedTextFieldProps = 'name' | 'value' | 'error' | 'onChange' | 'variant'

interface CreateTextFieldProps<T extends FormValues> extends Omit<
  MuiTextFieldProps, OmittedTextFieldProps
> {
  name: keyof T & string
  childrenRender?: (values: T) => React.ReactNode
}

export interface TextFieldProps<T extends FormValues> extends Omit<
  MuiTextFieldProps, OmittedTextFieldProps | 'helperText' | 'children'
> {
  form: Form<T>
}

export const createForm = <T extends FormValues>(
  rootDefaultValues: T,
  {
    validator,
  }: CreateUseFormOptions<T> = {},
) => {
  const useForm = ({
    values = rootDefaultValues,
    onChange,
  }: UseFormProps<T>) => {
    const errors = validator?.(values) || {} as FormErrors<T>

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e, values)
    }

    return {
      form: {
        values,
        errors,
        onChange: handleChange,
      },
    }
  }

  const useManagedForm = ({
    defaultValues = rootDefaultValues,
    onChange,
  }: UseManagedFormProps<T> = {}) => {
    const [values, setValues] = useState(defaultValues)
    const errors = validator?.(values) || {} as FormErrors<T>

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      onChange?.(e, values)
      setValues((state) => ({ ...state, [name]: value }))
    }

    return {
      form: {
        values,
        errors,
        onChange: handleChange,
      },
      setValues,
    }
  }

  const createTextField = ({
    name,
    helperText,
    className: baseClassName,
    style: baseStyle,
    children,
    childrenRender,
    ...props
  }: CreateTextFieldProps<T>) => ({
    form,
    className,
    style,
    ...overrides
  }: TextFieldProps<T>) => {
    const { values, errors, onChange } = form
    const value = values[name]
    const error = errors[name]

    return (
      <MuiTextField
        name={name}
        value={value}
        error={!!error}
        helperText={error ? helperText : error}
        onChange={onChange}
        className={clsx(baseClassName, className)}
        style={{ ...baseStyle, ...style }}
        {...props}
        {...overrides}
      >
        {childrenRender ? childrenRender(values) : children}
      </MuiTextField>
    )
  }

  return {
    useManagedForm,
    useForm,
    createTextField,
  }
}
