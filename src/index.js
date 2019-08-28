import React from 'react';
import ReactDOM from 'react-dom';
import App from '@components/App';

// Global site tag (gtag.js) - Google Analytics
if (process.env === 'production') {
  const script = document.createElement('sript');

  script.src = 'https://www.googletagmanager.com/gtag/js?id=UA-146416934-1';
  script.async = true;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];

  function gtag(rest) {
    window.dataLayer.push(rest);
  }
  gtag('js', new Date());
  gtag('config', 'UA-146416934-1');
}

ReactDOM.render(<App />, document.getElementById('root'));
