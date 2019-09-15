import React from 'react';

import style from './App.module.scss';

import Flat from './plot/flat';
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
      trace: null,
    };

    // listener on ipc render
    ipcRenderer.on('openFileErr', (event, arg) => {
      if (arg.err) {
        console.log(arg);
      }
    });
    ipcRenderer.on('openFileFinish', (event, arg) => {
      console.log('data receive', arg);
      this.setState((prevState) => ({
        ...prevState,
        trace: arg,
      }));
    });
  }

  componentDidMount() {
    ipcRenderer.send('getLast');
  }

  render() {
    const { trace, positionSelected } = this.state;

    if (!trace) {
      return (
        <div className={style.App}>
          <Header />
          No data - Click on add (Plus button)
        </div>
      )
    }

    return (
      <div className={style.App}>
        <Header />
        <div className={style.northLayout}>
          <div className={style.left}>
            <Info trace={trace} />
          </div>
          {
            trace.data
            && trace.data.fixes
            && <Flat
              className={style.right}
              points={trace.data.fixes}
              onClick={data => this.setState({positionSelected: data})}
            />
          }
        </div>
        <div className={style.southLayout}>
          {
            trace.data
              && trace.data.fixes
              && <MapWithTrace 
                points={trace.data.fixes}
                positionSelected={positionSelected}
              />
          }
        </div>
      </div>
    );
  }
}

export default App;
