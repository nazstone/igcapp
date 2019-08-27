import React from 'react';
import style from './App.module.scss';

// eslint-disable-next-line no-undef
const { ipcRenderer } = window.require('electron');

class App extends React.Component {
  constructor(props) {
    super(props);

    ipcRenderer.on('getIgcFileResult', (event, arg) => {
      console.log(arg);
    });
  }

  addTraceClick() {
    console.log('click trace add.', ipcRenderer);
    ipcRenderer.send('getIgcFileAsk');
  }

  render() {
    return (
      <div className={style.App}>
        <header className={style.AppHeader}>
          Welcome to your trace viewer
        </header>
        <div>
          <button type="button" onClick={() => this.addTraceClick()}>Add trace</button>
        </div>
      </div>
    );
  }
}

export default App;
