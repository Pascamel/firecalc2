import React from 'react';
import { ResponsiveContainer } from 'recharts';

interface IProps {
  children: JSX.Element;
}

const ResponsiveWrapper = ({ children }: IProps) => (
  <div style={{ height: '100%', width: '100%' }}>
    <ResponsiveContainer min-width="500" width={'100%'} height={'100%'}>
      {children}
    </ResponsiveContainer>
  </div>
);

export default ResponsiveWrapper;
