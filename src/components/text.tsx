import React from 'react';

import { joinFilter } from '../helpers';

interface IProps {
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  children: React.ReactNode;
  color?: string;
}

const Text = ({ children, className, color, ...otherProps }: IProps) => (
  <span
    className={joinFilter(
      className ? className : null,
      color ? `text-${color}` : null
    )}
    {...otherProps}
  >
    {children}
  </span>
);

export default Text;
