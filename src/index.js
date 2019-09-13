import React from 'react';
import ReactDOM from 'react-dom';
import App from '@components/App';

function gtag(rest) {
  window.dataLayer.push(rest);
}

// Global site tag (gtag.js) - Google Analytics
if (process.env.NODE_ENV === 'production') {
  const script = document.createElement('sript');

  script.src = 'https://www.googletagmanager.com/gtag/js?id=UA-146416934-1';
  script.async = true;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];

  gtag('js', new Date());
  gtag('config', 'UA-146416934-1');
}

ReactDOM.render(<App />, document.getElementById('root'));
