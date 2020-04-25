import React from 'react';

interface IProps {
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  children: React.ReactNode;
  color?: string;
}

const Text = ({ children, className, color, ...otherProps }: IProps) => {
  const combinedClassName = [
    className ? className : null,
    color ? `text-${color}` : null,
  ]
    .filter((v) => v !== null)
    .join(' ');

  return (
    <span className={combinedClassName} {...otherProps}>
      {children}
    </span>
  );
};

export default Text;
