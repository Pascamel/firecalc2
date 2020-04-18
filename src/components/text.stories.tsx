import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';

import rootReducers from '../reducers';
import { Icon, Text } from './';

let store = createStore(rootReducers);

storiesOf('Text', module)
  .add('Default', () => (
    <Provider store={store}>
      <Text>Default</Text>
    </Provider>
  ))
  .add('JSX children', () => (
    <Provider store={store}>
      <Text>
        <>
          <Icon icon="backward" />
          {/* <i className="fa fa-lg fa-sign-out pr-2" /> */}
          Sign Out
        </>
      </Text>
    </Provider>
  ))
  .add('Click event', () => (
    <Provider store={store}>
      <Text onClick={action('Clicked!')}>Click me!</Text>
    </Provider>
  ));
