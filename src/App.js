import React from 'react';

import style from './App.module.scss';

import MapWithTrace from './map/mapWithTrace';
import Info from './info';
import Header from './header/header';

// eslint-disable-next-line no-undef
const { ipcRenderer } = window.require('electron');

class App extends React.Component {
  constructor(props) {
    super(props);

    // define the state
    this.state = {
      trace: {},
    };

    // listener on ipc render
    ipcRenderer.on('addIgcFileResult', (event, arg) => {
      if (arg) {
        this.setState((prevState) => ({
          ...prevState,
          trace: arg,
        }));
      }
    });
    ipcRenderer.on('addIgcFileProgress', (event, arg) => {
      console.log('progress', arg);
    });
    ipcRenderer.on('selectedIgcResult', (event, arg) => {
      this.setState((prevState) => ({
        ...prevState,
        trace: arg,
      }));
    });
  }

  componentDidMount() {
    ipcRenderer.send('getIgcLast');
  }

  render() {
    const { trace } = this.state;

    return (
      <div className={style.App}>
        <Header />
        <div className={style.northLayout}>
          <div className={style.left}>
            <Info trace={trace} />
          </div>
          <div className={style.right}>
            Plot trace
          </div>
        </div>
        <div className={style.southLayout}>
          {
            trace
              && trace.data
              && trace.data.fixes
              && <MapWithTrace points={trace.data.fixes} />
          }
        </div>
      </div>
    );
  }
}

export default App;
