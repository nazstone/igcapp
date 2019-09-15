import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Modal,
  ModalBody,
  ModalHeader,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlusCircle,
  faSearch,
  faPaperPlane,
  faCheckCircle,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';


import style from './header.module.scss';
import SearchTrace from './search/search.trace';

// eslint-disable-next-line no-undef
const { ipcRenderer } = window.require('electron');

class Header extends React.Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
  };

  constructor(props) {
    super(props);

    this.state = {
      searchOpen: false,
    };
  }

  addTraceClick() {
    ipcRenderer.send('addIgcFileAsk');
  }

  searchDisplayModal() {
    this.setState((pvSt) => ({
      ...pvSt,
      resultDisplay: true,
    }));
  }

  searchHideModal() {
    this.setState((pvSt) => ({
      ...pvSt,
      resultDisplay: false,
    }));
  }


  render() {
    const { t, saveDisplay, saveAction, saveHide } = this.props;

    return (
      <Navbar color="light" light expand="lg">
        <FontAwesomeIcon icon={faPaperPlane} size="lg" />
        <NavbarBrand href="#" className={style.title}>{t('header_title')}</NavbarBrand>
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
          <NavItem>
            <NavLink href="#" onClick={() => this.addTraceClick()}>
              <FontAwesomeIcon icon={faPlusCircle} size="lg" />
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#">
              <FontAwesomeIcon icon={faSearch} size="lg" onClick={() => this.searchDisplayModal()} />
            </NavLink>
          </NavItem>
        </Nav>
        <Modal isOpen={this.state.resultDisplay} backdrop toggle={() => this.searchHideModal()}>
          <ModalHeader toggle={() => this.searchHideModal()}>{t('header_title_search')}</ModalHeader>
          <ModalBody>
            <SearchTrace hide={() => this.searchHideModal()} />
          </ModalBody>
        </Modal>
      </Navbar>
    );
  }
}

export default withTranslation()(Header);
