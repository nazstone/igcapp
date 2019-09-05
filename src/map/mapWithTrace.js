import React from 'react';
import {
  Map,
  Marker,
  Popup,
  Polyline,
  TileLayer,
} from 'react-leaflet';
import PropTypes from 'prop-types';
import L from 'leaflet';

import 'leaflet/dist/leaflet.css';
import style from './mapWithTrace.module.scss';

delete L.Icon.Default.prototype._getIconUrl;// eslint-disable-line no-underscore-dangle

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});


export default class MapWithTrace extends React.Component {
  static propTypes = {
    points: PropTypes.arrayOf(PropTypes.any),
  };

  static defaultProps = {
    points: [],
  };

  componentDidMount() {
    console.log('didmount', this.props);
  }

  render() {
    const position = this.props.points[0];
    return (
      <Map
        center={position}
        zoom={12}
        maxZoom={19}
        className={style.map}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
        />
        <Marker position={position}>
          <Popup>A pretty CSS3 popup.<br />Easily customizable.</Popup>
        </Marker>
        <Polyline
          positions={this.props.points}
        />
      </Map>
    );
  }
}
