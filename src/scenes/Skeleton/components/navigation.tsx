import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PeopleIcon from '@material-ui/icons/People';
import LockIcon from '@material-ui/icons/Lock'
import MemoryItem from '@material-ui/icons/Memory';
import DeveloperBoardItem from '@material-ui/icons/DeveloperBoard';
import MyLocationItem from '@material-ui/icons/MyLocation';
import TabletIcon from '@material-ui/icons/Tablet';
import ListIcon from '@material-ui/icons/List';
import BuildIcon from '@material-ui/icons/Build';
import {NavLink} from "react-router-dom";

export const mainListItems: React.ReactElement = (
    <div>
        <ListItem button={true} component={NavLink} to="/" exact={true} activeClassName="Mui-selected">
            <ListItemIcon>
                <DashboardIcon/>
            </ListItemIcon>
            <ListItemText primary="Dashboard"/>
        </ListItem>
        <ListItem button={true} component={NavLink} to="/users" activeClassName="Mui-selected">
            <ListItemIcon>
                <PeopleIcon/>
            </ListItemIcon>
            <ListItemText primary="Benutzer"/>
        </ListItem>
        <ListItem button={true} component={NavLink} to="/userPermissions" activeClassName="Mui-selected">
            <ListItemIcon>
                <LockIcon/>
            </ListItemIcon>
            <ListItemText primary="Berechtigungen"/>
        </ListItem>
        <ListItem button={true} component={NavLink} to="/actuators" activeClassName="Mui-selected">
            <ListItemIcon>
                <MemoryItem/>
            </ListItemIcon>
            <ListItemText primary="Aktoren"/>
        </ListItem>
        <ListItem button={true} component={NavLink} to="/machines" activeClassName="Mui-selected">
            <ListItemIcon>
                <DeveloperBoardItem/>
            </ListItemIcon>
            <ListItemText primary="Maschinen"/>
        </ListItem>
        <ListItem button={true} component={NavLink} to="/places" activeClassName="Mui-selected">
            <ListItemIcon>
                <MyLocationItem/>
            </ListItemIcon>
            <ListItemText primary="Orte"/>
        </ListItem>
        <ListItem button={true} component={NavLink} to="/accessDevices" activeClassName="Mui-selected">
            <ListItemIcon>
                <TabletIcon/>
            </ListItemIcon>
            <ListItemText primary="Zugriffsgeräte"/>
        </ListItem>
        <ListItem button={true} component={NavLink} to="/bookings" activeClassName="Mui-selected">
            <ListItemIcon>
                <ListIcon/>
            </ListItemIcon>
            <ListItemText primary="Buchungen"/>
        </ListItem>
    </div>
);

export const secondaryListItems: React.ReactElement = (
    <div>
        <ListSubheader inset={true}>Sonstiges</ListSubheader>
        <ListItem button={true} component={NavLink} to="/settings" activeClassName="Mui-selected">
            <ListItemIcon>
                <BuildIcon/>
            </ListItemIcon>
            <ListItemText primary="Einstellungen"/>
        </ListItem>
    </div>
);