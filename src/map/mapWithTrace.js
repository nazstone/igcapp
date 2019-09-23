import React from 'react';
import {
  Map,
  Marker,
  Popup,
  Polyline,
  TileLayer,
  ScaleControl,
} from 'react-leaflet';
import Control from 'react-leaflet-control';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import L from 'leaflet';
import iconMarkerRetina from 'leaflet/dist/images/marker-icon-2x.png';
import iconMarker from 'leaflet/dist/images/marker-icon.png';
import shadowUrlMarker from 'leaflet/dist/images/marker-shadow.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpand, faCompress } from '@fortawesome/free-solid-svg-icons';

import iconMarkerDark from './markers/marker-icon-black.png';

import { distance } from '../utils/latlngUtils';

import 'leaflet/dist/leaflet.css';
import style from './mapWithTrace.module.scss';


delete L.Icon.Default.prototype._getIconUrl;// eslint-disable-line no-underscore-dangle

L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconMarkerRetina,
  iconUrl: iconMarker,
  shadowUrl: shadowUrlMarker,
});

class MapWithTrace extends React.Component {
  static propTypes = {
    points: PropTypes.arrayOf(PropTypes.any),
    positionSelected: PropTypes.any, // eslint-disable-line react/forbid-prop-types
    positionHovered: PropTypes.any, // eslint-disable-line react/forbid-prop-types
    isFullScreen: PropTypes.bool,

    onSelectPosition: PropTypes.func,
    onFullScreenClick: PropTypes.func,

    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    points: [],
    positionSelected: undefined,
    positionHovered: undefined,
    isFullScreen: false,

    onSelectPosition: () => {},
    onFullScreenClick: undefined,
  };

  constructor(props) {
    super(props);

    this.state = {
      positionSelected: props.positionSelected,
      bounds: this.props.points,
    };

    this.dragHandler = this.dragHandler.bind(this);
    this.closestPoint = this.closestPoint.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      positionSelected: nextProps.positionSelected,
      bounds: undefined,
    });
  }


  getCenterPoint() {
    const minLat = this.props.points.reduce(
      (min, p) => (p.lat < min ? p.lat : min), Number.MAX_VALUE,
    );
    const minLng = this.props.points.reduce(
      (min, p) => (p.lng < min ? p.lng : min), Number.MAX_VALUE,
    );

    const maxLat = this.props.points.reduce(
      (max, p) => (p.lat > max ? p.lat : max), Number.MIN_VALUE,
    );
    const maxLng = this.props.points.reduce(
      (max, p) => (p.lng > max ? p.lng : max), Number.MIN_VALUE,
    );

    return {
      lat: (maxLat + minLat) / 2,
      lng: (maxLng + minLng) / 2,
    };
  }

  dragHandler(event) {
    const latlng = event.target._latlng;// eslint-disable-line no-underscore-dangle

    const betterPoint = this.closestPoint(latlng);
    this.setState({ positionSelected: betterPoint });
    this.props.onSelectPosition(betterPoint);
  }

  closestPoint(latlng) {
    let betterPoint;
    let betterDistance = Number.MAX_VALUE;
    this.props.points.forEach((pt) => {
      const dist = distance(pt.lat, pt.lng, latlng.lat, latlng.lng);
      if (dist < betterDistance) {
        betterPoint = pt;
        betterDistance = dist;
      }
    });
    return betterPoint;
  }

  render() {
    const position = this.props.positionHovered || this.props.points[0];
    const { positionSelected } = this.state;

    const myIcon = new L.Icon({
      iconUrl: iconMarkerDark,
      shadowUrl: shadowUrlMarker,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [-3, -76],
      shadowAnchor: [12, 41],
    });

    return (
      <Map
        center={this.getCenterPoint()}
        maxZoom={19}
        className={style.map}
        bounds={this.state.bounds}
        boundsOptions={{ padding: [50, 50] }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <ScaleControl />
        <Control position="topright">
          {this.props.onFullScreenClick && (
            <a
              href="#"
              onClick={this.props.onFullScreenClick}
              role="button"
              className={style.leafletButton}
            >
              <FontAwesomeIcon icon={this.props.isFullScreen ? faCompress : faExpand} />
            </a>
          )}
        </Control>
        <Marker position={position} opacity={this.props.positionHovered ? 1 : 0.5}>
          <Popup>
            <div>
              <b>{this.props.t('plot_pressalt')} : </b><span>{position.pressalt.toFixed(2)}</span><br />
              <b>{this.props.t('plot_gpsalt')} : </b><span>{position.gpsalt.toFixed(2)}</span><br />
              <b>{this.props.t('plot_lat')} : </b><span>{position.lat.toFixed(4)}</span><br />
              <b>{this.props.t('plot_lng')} : </b><span>{position.lng.toFixed(4)}</span><br />
              <b>{this.props.t('plot_speed')} : </b><span>{position.speed.toFixed(2)}</span><br />
            </div>
          </Popup>
        </Marker>
        {
          positionSelected && (
            <Marker
              position={positionSelected}
              icon={myIcon}
              onDragend={this.dragHandler}
              draggable
              opacity={0.8}
            >
              <Popup>
                <div>
                  <b>{this.props.t('plot_pressalt')} : </b><span>{positionSelected.pressalt.toFixed(2)}</span><br />
                  <b>{this.props.t('plot_gpsalt')} : </b><span>{positionSelected.gpsalt.toFixed(2)}</span><br />
                  <b>{this.props.t('plot_lat')} : </b><span>{positionSelected.lat.toFixed(4)}</span><br />
                  <b>{this.props.t('plot_lng')} : </b><span>{positionSelected.lng.toFixed(4)}</span><br />
                  <b>{this.props.t('plot_speed')} : </b><span>{positionSelected.speed.toFixed(2)}</span><br />
                </div>
              </Popup>
            </Marker>
          )
        }
        <Polyline
          color="rgba(30,144,255,0.55)"
          positions={this.props.points}
          onClick={(e) => this.props.onSelectPosition(this.closestPoint(e.latlng))}
        />
      </Map>
    );
  }
}

export default withTranslation()(MapWithTrace);
