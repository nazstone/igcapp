import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import style from './metadataInfo.module.scss';


// eslint-disable-next-line react/prefer-stateless-function
class Metadata extends React.Component {
  static propTypes = {
    metadata: PropTypes.any, // eslint-disable-line react/forbid-prop-types
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    metadata: null,
  };


  render() {
    const metadatas = [];
    const { metadata } = this.props;
    if (metadata) {
      // eslint-disable-next-line no-restricted-syntax
      for (const key of Object.keys(metadata)) {
        if (!metadata[key]) {
          // eslint-disable-next-line no-continue
          continue;
        }
        const val = metadata[key];
        const keyTr = this.props.t(`metadata_${key}`);
        if (typeof val === 'string') {
          metadatas.push(
            <div key={key} className={style.metadataLine}>
              <div>{keyTr}:</div>
              <div>{val}</div>
            </div>,
          );
        } else if (key === 'gps') {
          metadatas.push(
            <div key={key} className={style.metadataLine}>
              <div>{keyTr}:</div>
              <div>Manufacturer: {val.manufacturer}</div>
              <div>Uid: {val.uid}</div>
            </div>,
          );
        }
      }
    } else {
      return (<div />);
    }
    return (
      <div className={style.all}>
        {metadatas}
      </div>
    );
  }
}

export default withTranslation()(Metadata);
