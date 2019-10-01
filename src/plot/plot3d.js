import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Plotly from 'plotly.js/dist/plotly-gl3d';
import createPlotlyComponent from 'react-plotly.js/factory';

export default class Plot3d extends Component {
  static propTypes = {
    field: PropTypes.string.isRequired,
    points: PropTypes.arrayOf(Object),
    positionSelected: PropTypes.instanceOf(Object),
    onClick: PropTypes.func,
  };

  static defaultProps = {
    points: [],
    positionSelected: undefined,
    onClick: () => {},
  };

  static formatTime(value) {
    if (!value) return '';
    const time = new Date(value * 1000);
    const h = time.getHours();
    const m = time.getMinutes();
    const s = time.getSeconds();
    return `${(`0${h}`).slice(-2)}:${(`0${m}`).slice(-2)}:${(`0${s}`).slice(-2)}`;
  }

  static formatTooltip(x) {
    const crlf = '<br />';
    let tooltip = '';
    tooltip = '<b>Time : </b><i>';
    tooltip += `${Plot3d.formatTime(x.time.t)}</i>`;
    tooltip += crlf;
    tooltip += '<b>Latitude : </b><i>';
    tooltip += `${x.lat.toFixed(2)}</i>`;
    tooltip += crlf;
    tooltip += '<b>Longitude : </b><i>';
    tooltip += `${x.lng.toFixed(2)}</i>`;
    tooltip += crlf;
    tooltip += '<b>Altitude (pression) : </b><i>';
    tooltip += `${x.pressalt}</i> m.`;
    tooltip += crlf;
    tooltip += '<b>Altitude (GPS) : </b><i>';
    tooltip += `${x.gpsalt}</i> m.`;
    tooltip += crlf;
    tooltip += '<b>Speed : </b><i>';
    tooltip += `${x.speed.toFixed(2)}</i>`;
    return tooltip;
  }

  static median(values) {
    if (values.length === 0) return 0;
    values.sort((a, b) => a - b);
    const half = Math.floor(values.length / 2);
    if (values.length % 2) {
      return values[half];
    }
    return (values[half - 1] + values[half]) / 2.0;
  }

  constructor(props) {
    super(props);

    this.state = {};

    this.clickHandler = this.clickHandler.bind(this);
    this.getPoint = this.getPoint.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!nextProps.points) {
      return {};
    }
    const median = Plot3d.median(nextProps.points
      .map((x) => x.speed));
    const nextState = {
      data: [
        {
          type: 'scatter3d',
          mode: 'lines',
          ids: nextProps.points.map((x, index) => index),
          x: nextProps.points.map((x) => x.lng),
          y: nextProps.points.map((x) => x.lat),
          z: nextProps.points.map((x) => x[nextProps.field]),
          line: {
            color: nextProps.points.map((x) => {
              const percent = ((x.speed) * 50) / median;
              return `rgba(${percent * 2.55}, ${(100 - percent) * 2.55}, 0, 0.7)`;
            }),
            width: 3,
          },
          hoverinfo: 'text',
          text: nextProps.points.map((x) => Plot3d.formatTooltip(x)),
          hoverlabel: {
            bgcolor: 'gray',
            font: {
              color: 'black',
              size: 10,
            },
          },
        },
      ],
    };
    if (nextProps.positionSelected) {
      nextState.data.push({
        type: 'scatter3d',
        mode: 'markers',
        x: [nextProps.positionSelected.lng],
        y: [nextProps.positionSelected.lat],
        z: [nextProps.positionSelected[nextProps.field]],
        hoverinfo: 'text',
        text: nextProps.points.map((x) => Plot3d.formatTooltip(x)),
        marker: {
          color: 'rgba(0,0,0,0.5)',
          size: 3,
        },
      });
    }
    return nextState;
  }

  getPoint(data) {
    if (!data) return null;
    const { points } = data;
    if (!points || !points.length || points.length <= 0) return null;
    const index = points[0].id;
    if (!index
      || !this.props.points
      || !this.props.points.length
      || index >= this.props.points.length
      || index < 0) return null;
    const point = this.props.points[index];
    return point;
  }

  clickHandler(data) {
    const point = this.getPoint(data);
    if (!point) return true;
    this.props.onClick(point);
    return true;
  }

  render() {
    const PlotlyComponent = createPlotlyComponent(Plotly);

    const layout = {
      autosize: true,
      width: '100%',
      height: '100%',
      margin: {
        l: 0,
        r: 0,
        b: 0,
        t: 0,
      },
      scene: {
        aspectratio: {
          x: 1,
          y: 2,
          z: 2,
        },
        xaxis: {
          visible: true,
          showspikes: false,
          title: {
            text: 'Longitude',
          },
          autorange: 'reversed',
          scaleanchor: 'y',
        },
        yaxis: {
          visible: true,
          showspikes: false,
          title: {
            text: 'Latitude',
          },
          autorange: 'reversed',
          scaleanchor: 'x',
        },
        zaxis: {
          visible: true,
          showspikes: false,
          title: {
            text: 'Altitude',
          },
        },
      },
    };
    return (
      <PlotlyComponent
        data={this.state.data}
        layout={layout}
        config={{ showSendToCloud: false, displayModeBar: false }}
        style={{ width: '100%', height: '100%', flex: '1' }}
        useResizeHandler
        onClick={this.clickHandler}
      />
    );
  }
}
