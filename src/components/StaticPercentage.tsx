import React from 'react';

import helpers from '../helpers';

interface IProps {
  children: number;
}

const StaticPercentage = (props: IProps) => {
  const { children } = props;

  return (
    <React.Fragment>
      {helpers.percentage(children)}
    </React.Fragment>
  );
}

export default StaticPercentage;
