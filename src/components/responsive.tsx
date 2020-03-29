import React from 'react';
import Responsive from 'react-responsive';

export const Mobile = (props: any) => <Responsive {...props} maxWidth={767} />;
export const NotMobile = (props: any) => (
  <Responsive {...props} minWidth={768} />
);
