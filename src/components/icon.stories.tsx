import React from 'react';

import { storiesOf } from '@storybook/react';

import { Icon } from './';

storiesOf('icon', module)
  .add('Default', () => <Icon icon="university" />)
  .add('Non solid icon', () => <Icon icon={['far', 'save']} className="mr-1" />)

  .add('Spinner icon', () => <Icon icon="spinner" spin />)
  .add('Color icon', () => (
    <Icon icon="spinner" spin className="text-warning" />
  ));
