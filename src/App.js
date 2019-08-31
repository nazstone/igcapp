import React from 'react';
import style from './App.module.scss';

// eslint-disable-next-line no-undef
const { ipcRenderer } = window.require('electron');

class App extends React.Component {
  constructor(props) {
    super(props);

    ipcRenderer.on('addIgcFileAsk', (event, arg) => {
      console.log(arg);
    });
    ipcRenderer.on('getIgcFilesResult', (event, arg) => {
      console.log(arg);
    });
  }

  getTraceClick() {
    ipcRenderer.send('getIgcFiles');
  }

  addTraceClick() {
    ipcRenderer.send('addIgcFileAsk');
  }

  render() {
    return (
      <div className={style.App}>
        <header className={style.AppHeader}>
          Welcome to your trace viewer
        </header>
        <div>
          <button type="button" onClick={() => this.addTraceClick()}>Add trace</button>
          <button type="button" onClick={() => this.getTraceClick()}>Get trace</button>
        </div>
      </div>
    );
  }
}

export default App;
