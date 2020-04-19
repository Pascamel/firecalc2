import React from 'react';

interface IProps {
  className?: any;
  onClick?: any;
  children: React.ReactNode;
  color?: string;
}

const Text = (props: IProps) => {
  const { children, className, color, ...otherProps } = props;

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
