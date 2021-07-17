import React from 'react';
import WhiteTickIcon from '../../assets/WhiteTIck';

type Props = {
  name: string;
  labelClassName?: string;
  inputClassName?: string;
  onChange: (value: boolean) => void;
  children?: string | React.ReactNode;
  isChecked: boolean;
  required?: boolean;
  checkboxSize: string;
  size: number;
};

const Checkbox: React.FC<Props> = ({
  name,
  labelClassName,
  inputClassName,
  onChange,
  children,
  isChecked,
  required,
  checkboxSize,
  size,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked);
  };

  return (
    <label
      className={labelClassName || 'relative flex items-center pt-5 text-sm'}
    >
      <input
        name={name}
        type="checkbox"
        className={
          `${inputClassName} ${checkboxSize} ${
            isChecked ? 'compliant-bgColor' : 'border-gray-300 border'
          }` || 'mr-5 h-5 w-5'
        }
        checked={isChecked}
        onChange={handleChange}
        required={required}
      />
      {isChecked && (
        <span
          className={`${checkboxSize} absolute flex justify-center items-center`}
        >
          <WhiteTickIcon height={size} width={size} />
        </span>
      )}
      {children}
    </label>
  );
};

export default Checkbox;
