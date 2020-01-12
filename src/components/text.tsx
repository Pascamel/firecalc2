import React from 'react';

interface IProps {
  className?: any;
  onClick?: any;
  content: string;
}

const Text = (props: IProps) => {
  const {content, ...otherProps} = props;
  
  return <span {...otherProps}>{content}</span>
}

export default Text;
