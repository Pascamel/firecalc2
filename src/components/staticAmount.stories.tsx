import { storiesOf } from '@storybook/react';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import rootReducers from '../reducers';
import { StaticAmount } from '.'; ///components';

let store = createStore(rootReducers);

storiesOf('StaticAMount', module)
  .add('Default', () => {
    return (
      <Provider store={store}>
        <StaticAmount>{123.45}</StaticAmount>
      </Provider>
    );
  })
  .add('No decimals', () => {
    return (
      <Provider store={store}>
        <StaticAmount hide-decimals>{123.45}</StaticAmount>
      </Provider>
    );
  });
