import React from 'react';
type Props = {
  title: string;
  className?: string;
  type: 'submit' | 'button' | 'reset';
  hidden?: boolean;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  disabled?: boolean;
  icon?: React.SVGProps<SVGSVGElement>;
  iconDirection?: 'left' | 'right';
};

const Button: React.FC<Props> = ({
  title,
  className,
  type,
  hidden = false,
  onClick,
  disabled = false,
  icon,
  iconDirection,
}) => {
  const Icon: JSX.Element | undefined = icon && (
    <div className="inline-block hover:text-grey pr-2"> {icon}</div>
  );

  return (
    <button
      className={
        className ||
        'px-5 py-3 w-full bg-green-100 rounded text-base focus:bg-gray-400 hover:text-white'
      }
      onClick={onClick}
      hidden={hidden}
      type={type}
      disabled={disabled}
      
    >
      {iconDirection === 'left' && Icon}
      {title}
      {iconDirection === 'right' && Icon}
    </button>
  );
};

export default Button;
