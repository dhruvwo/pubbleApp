import * as React from 'react';
import * as _ from 'lodash';

export const isReadyRef = React.createRef();

export const navigationRef = React.createRef();

export function navigate(name, params) {
  if (navigationRef.current) {
    if (params && params.reset) {
      navigationRef.current.reset({
        index: 0,
        routes: [{name, params}],
      });
    } else {
      navigationRef.current.navigate(name, params);
    }
  }
}
