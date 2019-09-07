import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';
import classnames from 'classnames';

import FlightSumup from './flightSumup';
import Metadata from './metadataInfo';

// eslint-disable-next-line react/prefer-stateless-function
class Info extends React.Component {
  static propTypes = {
    trace: PropTypes.any, // eslint-disable-line react/forbid-prop-types
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    trace: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      activeTab: '1',
    };
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }

  render() {
    const { trace, t } = this.props;

    return (
      <>
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '1' })}
              onClick={() => { this.toggle('1'); }}
            >
              {t('general_info_title_main')}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '2' })}
              onClick={() => { this.toggle('2'); }}
            >
              {t('general_info_title_metadata')}
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1">
            {
              trace
                && trace.data
                && trace.data.track
                && <FlightSumup track={trace.data.track} date={trace.date} />
            }
          </TabPane>
          <TabPane tabId="2">
            {
              trace
                && trace.data
                && trace.data.metadata
                && <Metadata metadata={trace.data.metadata} />
            }
          </TabPane>
        </TabContent>
      </>
    );
  }
}

export default withTranslation()(Info);
