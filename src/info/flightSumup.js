import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import moment from 'moment';

import './info.scss';
import style from './flightSumup.module.scss';


// eslint-disable-next-line react/prefer-stateless-function
class FlightSumup extends React.Component {
  static propTypes = {
    date: PropTypes.string,
    track: PropTypes.any, // eslint-disable-line react/forbid-prop-types
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    track: null,
    date: null,
  };


  render() {
    const { track, t } = this.props;

    if (!track) {
      return (<div />);
    }

    return (
      <div className={style.parent}>
        <div className="line">
          <div>{t('sumup_date')}:</div>
          <div>{moment(this.props.date).format('DD MMM YY')}</div>
        </div>
        <div className="line">
          <div>{t('sumup_duration')}:</div>
          <div>{moment.utc(track.duration * 1000).format('HH:mm:ss')}</div>
        </div>
        <div className="line">
          <div>{t('sumup_distance')}:</div>
          <div>{Math.round(track.distance)}</div>
        </div>
        {/* <div className="line">
          <div>Time: </div>
          <div>14:51:18 - 17:33:29 UTC</div>
        </div> */}
        <div className="line">
          <div>{t('sumup_alt_max')}:</div>
          <div>{track.maxaltitude}</div>
        </div>
        <div className="line">
          <div>{t('sumup_alt_min')}:</div>
          <div>{track.minaltitude}</div>
        </div>
        {/* <div className="line">
          <div>Alt Average: </div>
          <div>{track.minaltitude}</div>
        </div> */}
      </div>
    );
  }
}

export default withTranslation()(FlightSumup);
