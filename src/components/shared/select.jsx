import React from 'react';

const CustomSelect = ({
  id,
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  style = {},
  className = '',
}) => {
  return (
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      style={{ color: '#202224', borderRadius: '8px', ...style }}
      className={`bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full ${className}`}
    >
      <option value="" disabled hidden>
        {placeholder}
      </option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default CustomSelect;
