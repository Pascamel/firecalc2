import React from 'react';

import { percentage } from '../helpers';

interface IProps {
  children: number;
}

const StaticPercentage = ({ children }: IProps) => {
  return <>{percentage(children)}</>;
};

export default StaticPercentage;
