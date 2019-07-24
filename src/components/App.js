import React from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import configureStore from '@store/store';
import theme from '@styles/theme/theme';
import GlobalStyle from '@styles/GlobalStyle';
import AppRouter from '@components/routers/AppRouter';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Provider store={configureStore()}>
        <GlobalStyle />
        <AppRouter />
      </Provider>
    </ThemeProvider>
  );
};

export default App;
