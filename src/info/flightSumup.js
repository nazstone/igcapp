import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

import Tag from '../tag/tag';
import './info.scss';
import style from './flightSumup.module.scss';

// eslint-disable-next-line no-undef
const { ipcRenderer } = window.require('electron');

class FlightSumup extends React.Component {
  static propTypes = {
    date: PropTypes.string,
    traceId: PropTypes.number,
    tags: PropTypes.arrayOf(PropTypes.any),
    track: PropTypes.any, // eslint-disable-line react/forbid-prop-types
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    track: null,
    date: null,
    traceId: null,
    tags: [],
  };

  constructor(props) {
    super(props);

    this.state = {
      tagDisplay: false,
    };
  }

  tagDisplay() {
    this.setState((pvSt) => ({
      ...pvSt,
      tagDisplay: !pvSt.tagDisplay,
    }));
  }

  addTag(text, traceId) {
    ipcRenderer.send('addNewTag', {
      text,
      traceId,
    });
    this.tagDisplay();
  }

  render() {
    const {
      track,
      t,
      tags,
      traceId,
    } = this.props;

    if (!track) {
      return (<div />);
    }

    return (
      <div className={style.parent}>
        <div className="line">
          <div className="title">{t('sumup_filename')}:</div>
          <div>{this.props.file.filename}</div>
        </div>
        <div className="line">{this.props.file.path}</div>
        <div className="line">
          <div className="title">{t('sumup_date')}:</div>
          <div>{moment(this.props.date, 'DDMMYY').format('DD MMM YY')}</div>
        </div>
        <div className="line">
          <div className="title">{t('sumup_duration')}:</div>
          <div>{moment.utc(track.duration * 1000).format('HH:mm:ss')}</div>
        </div>
        { traceId && <div className="line">
          <div className="title">{t('sumup_tag')}:</div>
          <div className={style.tags}>{
            tags.map((td) => (
              <Tag
                key={td.id}
                tag={td}
                traceId={traceId}
                remove
              />
            ))
          }
            {
              !this.state.tagDisplay
              && (
              <FontAwesomeIcon
                icon={faPlusCircle}
                size="lg"
                className={style.plus}
                onClick={() => this.tagDisplay()}
              />
              )
            }
            {
              this.state.tagDisplay
              && (
              <>
                <input type="text"
                  placeholder={t('sumup_type_tag')}
                  ref={el => this.inputRef = el}
                />
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  size="lg"
                  className={style.plus}
                  onClick={() => this.addTag(this.inputRef.value, traceId)}
                />
              </>
              )
            }
          </div>
        </div>}
        <div className="line">
          <div className="title">{t('sumup_distance')}:</div>
          <div>{Math.round(track.distance)}</div>
        </div>
        {/* <div className="line">
          <div>Time: </div>
          <div>14:51:18 - 17:33:29 UTC</div>
        </div> */}
        <div className="line">
          <div className="title">{t('sumup_alt_max')}:</div>
          <div>{track.maxaltitude}</div>
        </div>
        <div className="line">
          <div className="title">{t('sumup_alt_min')}:</div>
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
