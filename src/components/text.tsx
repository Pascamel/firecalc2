import React from 'react';

interface IProps {
  className?: any;
  onClick?: any;
  children: JSX.Element | string;
}

const Text = (props: IProps) => {
  const {children, ...otherProps} = props;
  
  return (
    <span {...otherProps}>
      {children}
    </span>
    );
}

export default Text;
