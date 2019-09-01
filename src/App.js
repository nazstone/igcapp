import React from 'react';
import style from './App.module.scss';

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
    let data;
    // eslint-disablne-next-line
    if (this.state.trace && this.state.trace.data) {
      data = this.state.trace.data.metadata['instrument-name'];
    }
    return (
      <div className={style.App}>
        <header className={style.AppHeader}>
          Welcome to your trace viewer
        </header>
        <div>
          <button type="button" onClick={() => this.addTraceClick()}>Add trace</button>
          <button type="button" onClick={() => this.getTraceClick()}>Get trace</button>
        </div>
        <div>Metadata: {data}</div>
      </div>
    );
  }
}

export default App;
