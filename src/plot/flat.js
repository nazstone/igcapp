import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import {
  FlexibleXYPlot,
  XAxis,
  YAxis,
  LineSeries,
  DiscreteColorLegend,
  MarkSeries,
  Crosshair,
  Highlight,
} from 'react-vis';


class Flat extends React.Component {
    static propTypes = {
      t: PropTypes.func.isRequired,

      points: PropTypes.arrayOf(PropTypes.any),
      positionSelected: PropTypes.any, // eslint-disable-line

      onMouseHover: PropTypes.func,
      onClick: PropTypes.func,
    }

    static defaultProps = {
      points: [],
      positionSelected: undefined,

      onMouseHover: () => {},
      onClick: () => {},
    }

    pressColor = 'rgba(204,255,204,1)';

    gpsColor = 'rgba(75,192,192,0.4)';

    constructor(props) {
      super(props);

      this.clickHandler = this.clickHandler.bind(this);
      this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
      this.legendsClickHandler = this.legendsClickHandler.bind(this);
      this.mousePositionHandler = this.mousePositionHandler.bind(this);
      this.generateTooltipStyle = this.generateTooltipStyle.bind(this);

      this.brush = false;

      this.state = {
        gpsVisibility: true,
        pressVisibility: true,
        areaFilter: null,
      };
    }

    mouseMoveHandler(index) {
      let point;
      if (index >= 0
            && index < this.props.points.length) {
        point = this.props.points[index];
      }
      this.setState({
        pointHover: point,
      });
      this.props.onMouseHover(point);
    }

    clickHandler(event) {
      if (this.brush) {
        this.brush = false;
        return;
      }
      if (event.button === 0) {
        this.props.onClick(this.state.pointHover);
      } else if (event.button === 2) {
        this.props.onClick(undefined);
      } else if (event.button === 1) {
        this.setState({
          areaFilter: null,
        });
      }
    }

    legendsClickHandler(val, index) {
      if (index === 0) {
        this.setState((prSt) => ({
          ...prSt,
          pressVisibility: !prSt.pressVisibility,
        }));
      }
      if (index === 1) {
        this.setState((prSt) => ({
          ...prSt,
          gpsVisibility: !prSt.gpsVisibility,
        }));
      }
    }

    mousePositionHandler(event) {
      this.setState({
        x: event.pageX,
        y: event.pageY,
        xPosition: (window.innerWidth > event.pageX + 220) ? 'right' : 'left', // eslint-disable-line
      });
    }

    formatTime(value) {
      if (!value) return '';
      const time = new Date(value * 1000);
      const h = time.getHours();
      const m = time.getMinutes();
      const s = time.getSeconds();
      return `${(`0${h}`).slice(-2)}:${(`0${m}`).slice(-2)}:${(`0${s}`).slice(-2)}`;
    }

    generateTooltipStyle() {
      if (this.state.xPosition === 'right') {
        return {
          width: '210px',
          fontSize: '10pt',
          backgroundColor: 'gray',
          borderRadius: '3px',
          padding: '5px',
          position: 'fixed',
          top: this.state.y + 10,
          left: this.state.x + 10,
          zIndex: '9999',
        };
      }
      return {
        width: '210px',
        fontSize: '10pt',
        backgroundColor: 'gray',
        borderRadius: '3px',
        padding: '5px',
        position: 'fixed',
        top: this.state.y + 10,
        left: this.state.x - 220,
        zIndex: '9999',
      };
    }

    render() {
      const pressAltData = this.props.points.map((pt) => ({
        x: pt.time.t,
        y: pt.pressalt,
      }));
      const gpsAltData = this.props.points.map((pt) => ({
        x: pt.time.t,
        y: pt.gpsalt,
      }));
      const pressAltHoveredPoint = {
        x: this.state.pointHover ? this.state.pointHover.time.t : 0,
        y: this.state.pointHover ? this.state.pointHover.pressalt : 0,
      };
      const gpsAltHoveredPoint = {
        x: this.state.pointHover ? this.state.pointHover.time.t : 0,
        y: this.state.pointHover ? this.state.pointHover.gpsalt : 0,
      };
      const hoveredPoint = [pressAltHoveredPoint, gpsAltHoveredPoint];
      const selectedPoint = [];
      if (this.state.pressVisibility) {
        selectedPoint.push({
          x: this.props.positionSelected ? this.props.positionSelected.time.t : 0,
          y: this.props.positionSelected ? this.props.positionSelected.pressalt : 0,
        });
      }
      if (this.state.gpsVisibility) {
        selectedPoint.push({
          x: this.props.positionSelected ? this.props.positionSelected.time.t : 0,
          y: this.props.positionSelected ? this.props.positionSelected.gpsalt : 0,
        });
      }

      const { areaFilter } = this.state;

      const styleAxis = {
        text: {
          fontSize: '8pt',
        },
        line: {
          stroke: 'rgba(0,0,0,0.1)',
        },
      };
      return (
        <div style={{
          width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
        }}
        >
          <DiscreteColorLegend
            style={{
              position: 'fixed', top: '60', right: '0', marginRight: '15px', marginTop: '15px', display: 'flex', flexDirection: 'column',
            }}
            items={[
              {
                title: this.props.t('plot_pressalt'),
                color: this.pressColor,
                strokeWidth: 2,
                disabled: !this.state.pressVisibility,
              }, {
                title: this.props.t('plot_gpsalt'),
                color: this.gpsColor,
                strokeWidth: 2,
                disabled: !this.state.gpsVisibility,
              },
            ]}
            onItemClick={this.legendsClickHandler}
          />
          <FlexibleXYPlot
            style={{ flex: '1' }}
            onMouseLeave={() => this.mouseMoveHandler(-1)}
            onMouseMove={this.mousePositionHandler}
            onMouseUp={(event) => this.clickHandler(event)}
            xDomain={areaFilter && [
              areaFilter.left,
              areaFilter.right,
            ]}
            yDomain={areaFilter && [
              areaFilter.bottom,
              areaFilter.top,
            ]}
          >
            <XAxis
              tickLabelAngle={-25}
              tickSize={3}
              tickFormat={(value) => this.formatTime(value)}
              style={styleAxis}
            />
            <YAxis
              tickSize={3}
              style={styleAxis}
            />

            {this.state.pressVisibility && (
              <LineSeries
                data={pressAltData}
                stroke={this.pressColor}
                strokeWidth="2px"
                style={{ fill: 'none' }}
                onNearestX={(value, { index }) => { this.mouseMoveHandler(index); }}
              />
            )}
            {this.state.gpsVisibility && (
              <LineSeries
                data={gpsAltData}
                stroke={this.gpsColor}
                strokeWidth="2px"
                style={{ fill: 'none' }}
                onNearestX={(value, { index }) => { this.mouseMoveHandler(index); }}
              />
            )}

            {/* dots for line series */}
            {this.state.pressVisibility && this.state.pointHover && (
              <MarkSeries
                data={[pressAltHoveredPoint]}
                fill={this.pressColor}
                color="lightgray"
                size="4"
              />
            )}
            {this.state.gpsVisibility && this.state.pointHover && (
              <MarkSeries
                data={[gpsAltHoveredPoint]}
                fill={this.gpsColor}
                color="lightgray"
                size="4"
              />
            )}

            {/* dots for selected point */}
            {this.props.positionSelected && (
              <MarkSeries
                data={selectedPoint}
                fill="rgba(0,0,0,0.3)"
                color="rgba(0,0,0,0.6)"
                size="3"
              />
            )}

            {/* Tooltip */}
            {this.state.pointHover && (
              <Crosshair
                values={hoveredPoint}
              >
                <div style={this.generateTooltipStyle()}>
                  <span><b>{this.props.t('plot_time')} : </b>{this.formatTime(this.state.pointHover.time.t)}</span><br />
                  <span><b>{this.props.t('plot_gpsalt')} : </b>{this.state.pointHover.gpsalt.toFixed(2)} m.</span><br />
                  <span><b>{this.props.t('plot_pressalt')} : </b>{this.state.pointHover.pressalt.toFixed(2)} m.</span><br />
                  <span><b>{this.props.t('plot_lat')} : </b>{this.state.pointHover.lat.toFixed(2)}</span><br />
                  <span><b>{this.props.t('plot_lng')} : </b>{this.state.pointHover.lng.toFixed(2)}</span><br />
                  <span><b>{this.props.t('plot_speed')} : </b>{this.state.pointHover.speed.toFixed(2)} km/h</span><br />
                </div>
              </Crosshair>
            )}

            <Highlight
              onBrushEnd={(e) => {
                if (e) this.brush = true;
                else return;
                this.setState({ areaFilter: e });
              }}
            />
          </FlexibleXYPlot>
        </div>
      );
    }
}

export default withTranslation()(Flat);
