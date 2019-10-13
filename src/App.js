import React, { Fragment } from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import style from './App.module.scss';

import Flat from './plot/flat';
import MapWithTrace from './map/mapWithTrace';
import Info from './info';
import Header from './header/header';

import {
  MAP,
  PLOT,
  D2,
  D3,
} from './utils/constants';

import icon from './sugar-glider.png';
import Plot3d from './plot/plot3d';

// eslint-disable-next-line no-undef
const TitleBar = window.require('frameless-titlebar');

// eslint-disable-next-line no-undef
const { ipcRenderer } = window.require('electron');


class App extends React.Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    // define the state
    this.state = {
      trace: null,
      principal: MAP,
      plotType: D2,
      mapFullScreen: false,
    };

    // listener on ipc render
    ipcRenderer.on('saveFileResult', (event, arg) => {
      if (!arg.ok) {
        console.error(arg.err);
        return;
      }
      this.setState((prSt) => {
        const tmp = prSt;
        tmp.trace.dbTrace.id = arg.data.id;
        return {
          ...tmp,
        };
      }, () => console.log(this.state));
    });

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
        positionSelected: undefined,
      }));
    });
  }

  componentDidMount() {
    ipcRenderer.send('getLast');
  }

  getPlot() {
    if (this.state.plotType === D3) return this.get3dPlot();
    return this.get2DPlot();
  }

  get2DPlot() {
    const { trace, positionSelected } = this.state;
    if (!trace || !trace.data || !trace.data.fixes) return (<Fragment />);
    return (
      <Flat
        className={style.right}
        points={trace.data.fixes}
        positionSelected={positionSelected}
        onMouseHover={(data) => this.setState({ positionHovered: data })}
        onClick={(data) => this.setState({ positionSelected: data })}
      />
    );
  }

  get3dPlot() {
    return (
      <Plot3d
        points={this.state.trace.data.fixes}
        positionSelected={this.state.positionSelected}
        onClick={(data) => this.setState({ positionSelected: data })}
        field="pressalt"
      />
    );
  }

  getMap() {
    const { trace, positionSelected, positionHovered } = this.state;
    if (!trace || !trace.data || !trace.data.fixes) return (<Fragment />);
    return (
      <MapWithTrace
        points={trace.data.fixes}
        positionSelected={positionSelected}
        positionHovered={positionHovered}
        isFullScreen={this.state.mapFullScreen}
        onSelectPosition={(data) => this.setState({ positionSelected: data })}
        onFullScreenClick={() => this.setState((prevState) => (
          { ...prevState, mapFullScreen: !prevState.mapFullScreen }
        ))}
      />
    );
  }

  getNorthRight() {
    const { principal } = this.state;
    if (principal === MAP) {
      return this.getPlot();
    }
    if (principal === PLOT) {
      return this.getMap();
    }
    return <Fragment />;
  }

  getSouth() {
    const { principal } = this.state;
    if (principal === MAP) {
      return this.getMap();
    }
    if (principal === PLOT) {
      return this.getPlot();
    }
    return <Fragment />;
  }

  render() {
    const {
      trace,
    } = this.state;

    if (!trace) {
      return (
        <div className={style.App}>
          <Header />
          No data - Click on add (Plus button)
        </div>
      );
    }

    return (
      <div className={style.App}>
        <TitleBar>
          <img
            src={icon}
            className={style.icon}
            alt=""
          />
          <span>{this.props.t('header_title')}</span>
        </TitleBar>
        <Header
          principal={!this.state.mapFullScreen && this.state.principal}
          plotType={!this.state.mapFullScreen && this.state.plotType}
          saveAction={() => {
            console.log('saving data', {
              date: trace.data.metadata.date,
              hash: trace.hash,
              path: trace.path,
            });
            ipcRenderer.send('saveTrace', {
              date: trace.data.metadata.date,
              hash: trace.hash,
              path: trace.path,
            });
          }}
          saveDisplay={
            (
              !this.state.hideSaveTrace || this.state.hideSaveTrace !== trace.hash
            ) && !(
              trace.dbTrace.id
            )
          }
          saveHide={() => {
            this.setState({
              hideSaveTrace: trace.hash,
            });
          }}
          switchPrincipal={() => {
            if (this.state.principal === MAP) this.setState({ principal: PLOT });
            else if (this.state.principal === PLOT) this.setState({ principal: MAP });
            else this.setState({ principal: undefined });
          }}
          switchPlotType={() => {
            if (this.state.plotType === D2) this.setState({ plotType: D3 });
            else if (this.state.plotType === D3) this.setState({ plotType: D2 });
            else this.setState({ plotType: undefined });
          }}
        />
        {
          this.state && this.state.mapFullScreen && (
            <div className={style.full}>
              {this.getMap()}
            </div>
          )
        }
        {
          (!this.state || !this.state.mapFullScreen) && (
            <Fragment>
              <div className={style.northLayout}>
                <div className={style.left}>
                  <Info trace={trace} />
                </div>
                <div className={style.right}>
                  {
                    this.getNorthRight()
                  }
                </div>
              </div>
              <div className={style.southLayout}>
                {
                  this.getSouth()
                }
              </div>
            </Fragment>
          )
        }
      </div>
    );
  }
}

export default withTranslation()(App);
