import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { storiesOf } from '@storybook/react';

import rootReducers from '../reducers';
import { StaticAmount } from './';

let store = createStore(rootReducers);

storiesOf('StaticAmount', module)
  .add('Default', () => (
    <Provider store={store}>
      <StaticAmount>{123.45}</StaticAmount>
    </Provider>
  ))
  .add('No decimals', () => (
    <Provider store={store}>
      <StaticAmount hide-decimals>{123.45}</StaticAmount>
    </Provider>
  ));
