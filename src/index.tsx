import 'bootstrap/dist/css/bootstrap.css';

import '../node_modules/font-awesome/css/font-awesome.min.css';
import './styles/fire.scss';
import './styles/tables.scss';
import './styles/404.scss';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { App } from './components';
import registerServiceWorker from './registerServiceWorker';
import store from './store';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>, 
  document.getElementById('root'));

registerServiceWorker();
