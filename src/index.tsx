import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from './components/App';

import 'bootstrap/dist/css/bootstrap.css';
import '../node_modules/font-awesome/css/font-awesome.min.css'; 
import './fire.scss';
import './flame.scss';

import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
