import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import {
  Navbar,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';

import style from './header.module.scss';

class Header extends React.Component {
  static propTypes = {
    saveDisplay: PropTypes.bool,
    saveAction: PropTypes.func,
    saveHide: PropTypes.func,
  };

  static defaultProps = {
    saveDisplay: false,
    saveAction: () => {},
    saveHide: () => {},
  };

  render() {
    const {
      saveDisplay, saveAction, saveHide,
    } = this.props;

    return (
      <Navbar color="light" light expand="lg" className={style.bar}>
        <Nav className="ml-auto">
          {
            saveDisplay
            && (
            <NavItem href="#">
              <NavLink href="#" className={style.save}>
                <div>Save:</div>
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  size="lg"
                  color="green"
                  onClick={() => saveAction()}
                  className={style.button}
                />
                <FontAwesomeIcon
                  icon={faTimesCircle}
                  size="lg"
                  color="red"
                  onClick={() => saveHide()}
                  className={style.button}
                />
              </NavLink>
            </NavItem>
            )
          }
        </Nav>
      </Navbar>
    );
  }
}

export default withTranslation()(Header);
