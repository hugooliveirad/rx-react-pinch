import React from 'react';
import Pinch from './Pinch.js';
import s from 'react-prefixr';

export default class App extends React.Component {
  render() {
    return (
      <Pinch render={scale => {
        return (
          <img 
            src="https://download.unsplash.com/photo-1428342319217-5fdaf6d7898e"
            style={s({
              width: '100%', 
              height: 'auto', 
              transform: `scale(${scale})`
            })} />
        );
      }} />
    );
  }
}
