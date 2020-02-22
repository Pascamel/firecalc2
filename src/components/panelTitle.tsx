import React from 'react';

import helpers from '../helpers';
import { Text } from '.';

interface IProps {
  title: string;
  subTitle?: string;
};

const PanelTitle = (props: IProps) => {
  const { title, subTitle } = props;
  return (
    <>
      <h3>
        {title}
        {subTitle && (
          <Text className="pull-right text-secondary font-weight-normal">
            {subTitle}
          </Text>
        )}
      </h3>
      <hr />
    </>
  );
};

export default PanelTitle;
