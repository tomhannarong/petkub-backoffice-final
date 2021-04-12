import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Drawer from '@material-ui/core/Drawer';
import SideNavMenu from './SideNavMenu';
import styles from '../Sidebar/sidebar-jss';

function createData(id, name, url) {
  return {
    id,
    name,
    url,
  };
}

function SideNav(props) {
  const {
    classes,
    open,
    gotoSlide,
    curSlide
  } = props;

  const anchor = 'left';
  const menuList = [
    createData(0, 'find', '/find'),
    createData(1, 'found', '/found'),
    createData(2, 'free', '/free'),
    createData(3, 'loginforadmin', '/loginforadmin'),
  ];

  return (
    <Drawer
      variant="permanent"
      classes={{
        paper: classNames(classes.drawer, classes.drawerPaper, !open ? classes.drawerPaperClose : ''),
      }}
      open={open}
      anchor={anchor}
    >
      <SideNavMenu
        drawerPaper={open}
        menuList={menuList}
        gotoSlide={gotoSlide}
        active={curSlide}
      />
    </Drawer>
  );
}

SideNav.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  gotoSlide: PropTypes.func.isRequired,
  curSlide: PropTypes.number.isRequired,
};

export default withStyles(styles)(SideNav);
