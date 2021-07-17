import React from 'react';
type Props = {
  className?: string;
  type: string;
  value: string;
  label?: React.ReactNode;
  onChange: (value: string, name?: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  attributes?: Record<string, string | boolean | number>;
};

const Input: React.FC<Props> = ({
  className,
  type,
  label,
  placeholder,
  value,
  disabled = false,
  required,
  onChange,
  attributes = {},
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <>
      {label}
      <input
        className={
          className ||
          'block w-full p-2 border rounded border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent'
        }
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        required={required}
        disabled={disabled}
        {...attributes}
      />
    </>
  );
};

export default Input;
