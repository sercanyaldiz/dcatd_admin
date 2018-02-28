import React from 'react';
import { NavLink } from 'react-router-dom';
import { Container, Menu } from 'semantic-ui-react';

import { logout } from '../services/auth/auth';

const Header = () => (
  <Menu fixed="top" inverted>
    <Container>
      <Menu.Item header>
        <NavLink to="/dcatd_admin/datasets">
          DataPunt catalogus beheer
        </NavLink>
      </Menu.Item>
      <Menu.Item>
        <NavLink to="/dcatd_admin/datasets">
          Koppelingen
        </NavLink>
      </Menu.Item>
      <Menu.Menu position="right">
        <Menu.Item onClick={logout}>
          Uitloggen
        </Menu.Item>
      </Menu.Menu>
    </Container>
  </Menu>
);

export default Header;
