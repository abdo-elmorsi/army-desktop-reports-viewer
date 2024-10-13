import React from 'react';
import ReactSelect from 'react-select';
import TextError from "./TextError";

const Select = ({
  label,
  validator,
  mandatory,
  submitted,
  isMulti = false,
  isClearable = true,
  formGroup = true,
  small = false,
  async = false,
  autoHeight = false,
  className = "",
  cacheOptions = true,
  placeholder = "أختر واحدا",
  ...props
}) => {
  const hasWarning = submitted && validator && !validator.valid;
  const isDark = document.querySelector("html").classList.contains("dark");

  const customStyles = {
    control: (styles, { isFocused }) => ({
      ...styles,
      backgroundColor: isDark ? '#1f2937' : '#FFFFFF',
      borderColor: isFocused ? '#002768' : hasWarning ? '#F56565' : '#DCDFE3',
      color: isDark ? '#FFFFFF' : '#FFFFFF',
      boxShadow: isFocused ? '0 0 0 1px #002768' : 'none',
      '&:hover': {
        borderColor: hasWarning ? '#F56565' : '#002768cc',
      },
    }),
    option: (styles, { isDisabled, isSelected, isFocused }) => ({
      ...styles,
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      backgroundColor: isDisabled
        ? undefined
        : isSelected
          ? '#002768'
          : isFocused
            ? '#002768cc'
            : "transparent",
      "&:hover": {
        ...styles["&:hover"],
        backgroundColor: isSelected
          ? '#002768'
          : '#002768cc',
      },
      ':active': {
        ...styles[':active'],
        backgroundColor: !isDisabled
          ? isSelected
            ? '#002768'
            : '#002768cc'
          : undefined,
      },
    }),

    menu: (styles) => ({
      ...styles,
      backgroundColor: isDark ? '#1f2937' : '#e8fffe',
      color: isDark ? '#FFFFFF' : '#336a86',
    }),
    singleValue: (styles) => ({
      ...styles,
      color: isDark ? '#FFFFFF' : '#002768',
    }),
    placeholder: (styles) => ({
      ...styles,
      color: isDark ? '#FFFFFF' : '#002768',
    }),
  };

  return (
    <div
      className={`w-full ${formGroup ? 'form-group' : ''} ${hasWarning ? '-mb-1' : ''}`}
    >
      {label && (
        <label className={`block text-${small ? 'sm' : 'md'} text-gray-800 dark:text-white pb-1`}>
          {label} {mandatory && <span className="text-red-500">*</span>}
        </label>
      )}
      <ReactSelect
        className={`react-select ${className} ${hasWarning ? 'border-red-500 text-red-500' : ''}`}
        styles={selectStyles(small, autoHeight)}
        isMulti={isMulti}

        isClearable={isClearable}
        placeholder={placeholder}
        {...props}
      />
      {hasWarning && <TextError>{validator.message}</TextError>}
    </div>
  );
};

export default Select;

const selectStyles = (small, autoHeight) => {
  const height = autoHeight ? 'auto' : small ? '30px' : '41.90px';

  let options = {
    control: (styles) => ({
      ...styles,
      borderColor: '#dee2e6',
      borderRadius: '0.25rem',
      height: height,
      minHeight: height,
      cursor: 'pointer',
    }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => (
      {
        ...styles,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        backgroundColor: isDisabled
          ? undefined
          : isSelected
            ? '#002768'
            : isFocused
              ? '#FFF4EB'
              : "transparent",
        "&:hover": {
          ...styles["&:hover"],
          backgroundColor: isSelected
            ? '#002768'
            : '#FFF4EB',
        },
        ':active': {
          ...styles[':active'],
          backgroundColor: !isDisabled
            ? isSelected
              ? '#002768'
              : '#FFF4EB'
            : undefined,
        },
      }
    ),
    placeholder: (styles) => ({ ...styles, color: '#999' }),
    menu: (styles) => {
      return { ...styles, zIndex: 1030 };
    },
  }
  if (small) {
    options = {
      ...options,
      ...{
        dropdownIndicator: base => ({
          ...base,
          padding: 4
        }),
        clearIndicator: base => ({
          ...base,
          padding: 4
        }),
        valueContainer: base => ({
          ...base,
          padding: '0px 6px'
        }),
        input: base => ({
          ...base,
          margin: 0,
          padding: 0
        })
      }
    }
  }

  return options;
};