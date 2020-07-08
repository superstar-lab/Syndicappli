import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {  Drawer } from '@material-ui/core';
import PeopleIcon from '@material-ui/icons/People';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import TextFieldsIcon from '@material-ui/icons/TextFields';
import ImageIcon from '@material-ui/icons/Image';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import SettingsIcon from '@material-ui/icons/Settings';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import HomeIcon from '@material-ui/icons/Home';
import authService from '../../../../services/authService.js';
import { Profile, SidebarNav, UpgradePlan } from './components';

const useStyles = makeStyles(theme => ({
  drawer: {
    [theme.breakpoints.up('xl')]: {
      width: 333,
    },
    [theme.breakpoints.between('lg','lg')]: {
      width: 233,
    },
    [theme.breakpoints.between('md','md')]: {
      width: 163,
    },
    [theme.breakpoints.between('sm','sm')]: {
      width: 114,
    },
    [theme.breakpoints.down('sm')]: {
      width: 80,
    },
  },
  icon: {
    '&:hover,&:focus': {
      // backgroundColor: 'white',
      color:'#00bf82',
    },
    [theme.breakpoints.up('xl')]: {
      width: 24,
      height: 24,
    },
    [theme.breakpoints.between('lg','lg')]: {
      width: 17,
      height: 17,
    },
    [theme.breakpoints.between('md','md')]: {
      width: 12,
      height: 12,
    },
    [theme.breakpoints.between('sm','sm')]: {
      width: 8,
      height: 8,
    },
    [theme.breakpoints.down('sm')]: {
      width: 6,
      height: 6,
    },
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(2)
  },
  root: {
    background: 'linear-gradient(0deg, #00C9FF 30%, #0CC77C 100%)',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflowX: 'hidden',
    justifyContent: 'space-between'
  },
  divider: {
    margin: theme.spacing(2, 0)
  },
  nav: {
    marginBottom: theme.spacing(2)
  }
}));

const Sidebar = props => {
  const { open, variant, onClose, className, ...rest } = props;

  const classes = useStyles();
  const webApp = authService.getAccess('web_app');  
  const accessUsers = authService.getAccess('role_users');  
  const accessCompanies = authService.getAccess('role_companies'); 
  const accessBuildings = authService.getAccess('role_buildings'); 
  const accessDiscountCodes = authService.getAccess('role_discountcodes'); 
  const accessOwners = authService.getAccess('role_owners'); 
  const accessProducts = authService.getAccess('role_products'); 
  const accessManagers = authService.getAccess('role_managers'); 
  const accessOrders = authService.getAccess('role_orders'); 

  const admin_pages = [
    {
      title: 'Dashboard',
      href: '/admin/dashboard',
      icon: <HomeIcon className={classes.icon}/>,
      status: 'visible'
    },
    {
      title: 'Companies',
      href: '/admin/companies',
      icon: <TextFieldsIcon className={classes.icon}/>,
      status: accessCompanies
    },
    {
      title: 'Managers',
      href: '/admin/managers',
      icon: <AccountBoxIcon className={classes.icon}/>,
      status: accessManagers
    },
    {
      title: 'Buildings',
      href: '/admin/buildings',
      icon: <PeopleIcon className={classes.icon}/>,
      status: accessBuildings
    },
    {
      title: 'Owners',
      href: '/admin/owners',
      icon: <SettingsIcon className={classes.icon}/>,
      status: accessOwners
    },
    {
      title: 'Orders',
      href: '/admin/orders',
      icon: <SettingsIcon className={classes.icon}/>,
      status: accessOrders
    },
    {
      title: 'Products',
      href: '/admin/products',
      icon: <LockOpenIcon className={classes.icon}/>,
      status: accessProducts
    },
    {
      title: 'Discount Codes',
      href: '/admin/discountcodes',
      icon: <ImageIcon className={classes.icon}/>,
      status: accessDiscountCodes
    },
    {
      title: 'Users',
      href: '/admin/users',
      icon: <ShoppingBasketIcon className={classes.icon}/>,
      status: accessUsers
    },
  ];
  
  const manager_pages = [
    {
      title: 'Accueil',
      href: '/manager/dashboard',
      icon: <HomeIcon className={classes.icon}/>,
      status: 'visible'
    },
    {
      title: 'Mes immeubles',
      href: '/manager/buildings',
      icon: <TextFieldsIcon className={classes.icon}/>,
      status: accessBuildings
    },
    {
      title: 'Mes Copropriétaires',
      href: '/manager/owners',
      icon: <AccountBoxIcon className={classes.icon}/>,
      status: accessManagers
    },
    {
      title: 'Messagerie',
      href: '/manager/chat',
      icon: <PeopleIcon className={classes.icon}/>,
      status: accessBuildings
    },
    {
      title: 'Incidents',
      href: '/manager/incidents',
      icon: <SettingsIcon className={classes.icon}/>,
      status: accessOwners
    },
    {
      title: 'Assemblées',
      href: '/manager/assemblies',
      icon: <LockOpenIcon className={classes.icon}/>,
      status: accessProducts
    },
    {
      title: 'Événements',
      href: '/manager/events',
      icon: <ImageIcon className={classes.icon}/>,
      status: accessDiscountCodes
    },
    {
      title: 'Mon équipe',
      href: '/manager/team',
      icon: <ShoppingBasketIcon className={classes.icon}/>,
      status: accessDiscountCodes
    },
    {
      title: 'Mes prestataires',
      href: '/manager/providers',
      icon: <LockOpenIcon className={classes.icon}/>,
      status: accessProducts
    },
    {
      title: 'Annonces',
      href: '/manager/announcements',
      icon: <ImageIcon className={classes.icon}/>,
      status: accessDiscountCodes
    },
    {
      title: 'Modules',
      href: '/manager/addons',
      icon: <ShoppingBasketIcon className={classes.icon}/>,
      status: accessDiscountCodes
    },
  ];
  const owner_pages = [
    {
      title: 'Accueil',
      href: '/owner/dashboard',
      icon: <HomeIcon className={classes.icon}/>,
      status: 'visible'
    },
    {
      title: 'Messagerie',
      href: '/owner/chat',
      icon: <TextFieldsIcon className={classes.icon}/>,
      status: accessCompanies
    },
    {
      title: 'Incidents',
      href: '/owner/incidents',
      icon: <AccountBoxIcon className={classes.icon}/>,
      status: accessManagers
    },
    {
      title: 'Assemblées',
      href: '/owner/assemblies',
      icon: <PeopleIcon className={classes.icon}/>,
      status: accessBuildings
    },
    {
      title: 'Événements',
      href: '/owner/events',
      icon: <SettingsIcon className={classes.icon}/>,
      status: accessOwners
    },
    {
      title: 'Modules',
      href: '/owner/addons',
      icon: <SettingsIcon className={classes.icon}/>,
      status: accessOrders
    },
  ];
  return (
    <Drawer
      anchor="left"
      classes={{ paper: classes.drawer }}
      onClose={onClose}
      open={open}
      variant={variant}
    >
    {/* <Scrollbars style={{ height: "100vh" }}> */}

      <div
        {...rest}
        className={clsx(classes.root, className)}
      >
        <div>
          <Profile />
          <SidebarNav
            className={classes.nav}
            pages={webApp === 'manager' ? manager_pages : webApp === 'owner' ? owner_pages : admin_pages}
          />
        </div>
        <UpgradePlan />
      </div>
    {/* </Scrollbars> */}

    </Drawer>
  );
};

Sidebar.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  variant: PropTypes.string.isRequired
};

export default Sidebar;
