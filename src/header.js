import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faSearch, faEllipsisH } from '@fortawesome/free-solid-svg-icons';


// eslint-disable-next-line no-undef
const { ipcRenderer } = window.require('electron');

class Header extends React.Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
  };

  addTraceClick() {
    console.log('tada');
    ipcRenderer.send('addIgcFileAsk');
  }

  render() {
    const { t } = this.props;

    return (
      <Navbar color="light" light expand="md">
        <NavbarBrand href="/">{t('header_title')}</NavbarBrand>
        <NavbarToggler onClick={this.toggle} />
        <Collapse isOpen navbar>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink href="#" onClick={() => this.addTraceClick()}>
                <FontAwesomeIcon icon={faPlusCircle} size="lg" />
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#">
                <FontAwesomeIcon icon={faSearch} size="lg" />
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#">
                <FontAwesomeIcon icon={faEllipsisH} size="lg" />
              </NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
}

export default withTranslation()(Header);
