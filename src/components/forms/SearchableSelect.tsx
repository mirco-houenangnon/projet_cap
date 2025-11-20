import React from 'react'
import Select from 'react-select'
import { CFormLabel } from '@coreui/react'

interface Option {
  value: string | number
  label: string
}

interface SearchableSelectProps {
  id?: string
  label?: string
  value: string | number | (string | number)[]
  onChange: (value: string | number | (string | number)[]) => void
  options: Option[]
  placeholder?: string
  required?: boolean
  disabled?: boolean
  isClearable?: boolean
  multiple?: boolean
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  id,
  label,
  value,
  onChange,
  options,
  placeholder = 'Sélectionner...',
  required = false,
  disabled = false,
  isClearable = false,
  multiple = false,
}) => {
  const selectedOption = multiple
    ? options.filter(opt => Array.isArray(value) && value.map(v => v.toString()).includes(opt.value.toString()))
    : options.find(opt => opt.value.toString() === value.toString()) || null

  return (
    <div className="mb-3">
      {label && (
        <CFormLabel htmlFor={id}>
          {label}
          {required && <span className="text-danger ms-1">*</span>}
        </CFormLabel>
      )}
      <Select
        inputId={id}
        value={selectedOption}
        onChange={(option) => {
          if (multiple) {
            onChange(Array.isArray(option) ? option.map(o => o.value) : [])
          } else {
            onChange(option ? (option as Option).value : '')
          }
        }}
        options={options}
        placeholder={placeholder}
        isDisabled={disabled}
        isClearable={isClearable}
        isSearchable
        isMulti={multiple}
        styles={{
          control: (base) => ({
            ...base,
            minHeight: '37px',
          }),
        }}
      />
    </div>
  )
}

export default SearchableSelect
