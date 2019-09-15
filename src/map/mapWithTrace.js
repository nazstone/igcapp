import React from 'react';
import {
  Map,
  Marker,
  Popup,
  Polyline,
  TileLayer,
} from 'react-leaflet';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import L from 'leaflet';

import 'leaflet/dist/leaflet.css';
import style from './mapWithTrace.module.scss';

delete L.Icon.Default.prototype._getIconUrl;// eslint-disable-line no-underscore-dangle

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});


class MapWithTrace extends React.Component {
  static propTypes = {
    points: PropTypes.arrayOf(PropTypes.any),
    positionSelected: PropTypes.any,

    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    points: [],
    positionSelected: undefined,
  };

  componentDidMount() {
    console.log('didmount', this.props);
  }

  render() {
    const position = this.props.points[0];
    const { positionSelected } = this.props;

    return (
      <Map
        center={position}
        zoom={12}
        maxZoom={19}
        className={style.map}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {
          positionSelected && (
            <Marker position={positionSelected}>
              <Popup>
                <div>
                  <b>{this.props.t('plot_pressalt')} : </b><span>{positionSelected.pressalt.toFixed(2)}</span><br/>
                  <b>{this.props.t('plot_gpsalt')} : </b><span>{positionSelected.gpsalt.toFixed(2)}</span><br/>
                  <b>{this.props.t('plot_lat')} : </b><span>{positionSelected.lat.toFixed(4)}</span><br/>
                  <b>{this.props.t('plot_lng')} : </b><span>{positionSelected.lng.toFixed(4)}</span><br/>
                  <b>{this.props.t('plot_speed')} : </b><span>{positionSelected.speed.toFixed(2)}</span><br/>
                </div>
              </Popup>
            </Marker>
          )
        }
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

export default withTranslation()(MapWithTrace);
