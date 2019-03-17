import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from './components/App';

import 'bootstrap/dist/css/bootstrap.css';
import '../node_modules/font-awesome/css/font-awesome.min.css'; 
import './styles/fire.scss';
import './styles/flame.scss';
import './styles/tables.scss';

import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
