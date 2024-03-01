import App from './App';
import React from 'react';
import reportWebVitals from './reportWebVitals';
import './index.css';
import ReactDOM from 'react-dom';

function tick() {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
  );
}

reportWebVitals();

setInterval(tick, 1000/60);
