import {AppRegistry} from 'react-native';
import React from 'react';
import App from './App';
import {name as appName} from './app.json';
import {Provider} from 'react-redux';

import {Provider as ThemeProvider} from '@ant-design/react-native';
import customTheme from './customTheme';

import store from './src/store';

const RNRedux = () => (
  <ThemeProvider theme={customTheme}>
    <Provider store={store}>
      <App />
    </Provider>
  </ThemeProvider>
);

AppRegistry.registerComponent(appName, () => RNRedux);
