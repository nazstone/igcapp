import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';

import style from './tag.module.scss';

// eslint-disable-next-line no-undef
const { ipcRenderer } = window.require('electron');

class Tag extends React.Component {
  static propTypes = {
    tag: PropTypes.any, // eslint-disable-line react/forbid-prop-types
    remove: PropTypes.bool,
    traceId: PropTypes.number,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    tag: null,
    traceId: null,
    remove: false,
  };

  removeTag(id, traceId) {
    ipcRenderer.send('removeTagById', {
      id,
      traceId,
    });
  }

  render() {
    const {
      t,
      tag,
      remove,
      traceId,
    } = this.props;

    return (
      <div className={style.parent}>
        {tag.text}
        { remove && (
        <FontAwesomeIcon
          icon={faTimesCircle}
          size="sm"
          className={style.removeIcon}
          onClick={() => this.removeTag(tag.id, traceId)}
          alt="Remove tag"
        />
        )}
      </div>
    );
  }
}

export default withTranslation()(Tag);
