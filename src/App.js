import React from 'react';

import style from './App.module.scss';
import Metadata from './info/metadataInfo';
import MapWithTrace from './map/mapWithTrace';

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
      console.log('add file', arg);
      this.setState((prevState) => ({
        ...prevState,
        trace: arg,
      }));
    });
    ipcRenderer.on('addIgcFileProgress', (event, arg) => {
      console.log('progress', arg);
    });
    ipcRenderer.on('getIgcFilesResult', (event, arg) => {
      console.log('get files', arg);
    });
    ipcRenderer.on('getIgcLastResult', (event, arg) => {
      console.log('get last file', arg);
      this.setState((prevState) => ({
        ...prevState,
        trace: arg,
      }));
    });
  }

  componentDidMount() {
    ipcRenderer.send('getIgcLast');
  }

  getTraceClick() {
    ipcRenderer.send('getIgcFiles');
  }

  addTraceClick() {
    ipcRenderer.send('addIgcFileAsk');
  }

  render() {
    const { trace } = this.state;
    let metadataCompo;
    if (trace && trace.data && trace.data.metadata) {
      metadataCompo = <Metadata metadata={trace.data.metadata} />;
    } else {
      return (<div />);
    }
    return (
      <div className={style.App}>
        <div className={style.header}>
          <div className={style.title}>IGC APP</div>
          <button type="button" onClick={() => this.addTraceClick()}>Add trace</button>
          <button type="button" onClick={() => this.getTraceClick()}>Get trace</button>
        </div>
        <div className={style.northLayout}>
          <div className={style.left}>
            {metadataCompo}
          </div>
          <div className={style.right}>
            Plot trace
          </div>
        </div>
        <div className={style.southLayout}>
          <MapWithTrace points={trace.data.fixes} />
        </div>
      </div>
    );
  }
}

export default App;
