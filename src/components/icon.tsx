import React from 'react';

import { IconProp, SizeProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface IProps {
  className?: string;
  icon: IconProp;
  size?: SizeProp;
  spin?: boolean;
}

const Icon = (props: IProps) => {
  return <FontAwesomeIcon {...props} />;
};

export { Icon };
