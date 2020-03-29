import React from 'react';

import helpers from '../helpers';

interface IProps {
  children: number;
}

const StaticPercentage = (props: IProps) => {
  const { children } = props;

  return <>{helpers.percentage(children)}</>;
};

export default StaticPercentage;
