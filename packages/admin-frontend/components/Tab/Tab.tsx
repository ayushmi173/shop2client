import React from 'react';

type Props<T = string> = {
  label: T;
  isActive?: boolean;
  onClick: (label: T) => void;
  className?: string;
};

const Tab: <T>(p: Props<T>) => React.ReactElement<Props<T>> = ({
  label,
  isActive,
  onClick,
  className,
}) => {
  return (
    <button
      type="button"
      className={`${
        isActive
          ? className ||
            'compliant-textColor hover:compliant-textColor text-base font-semibold '
          : className || 'text-gray-800 text-base font-semibold'
      } focus:outline-none no-underline`}
      onClick={() => onClick(label)}
    >
      {label}
    </button>
  );
};

export default Tab;
