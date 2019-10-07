import React from 'react';
import clsx from 'clsx';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';
import PersonIcon from '@material-ui/icons/Person';
import {BrowserRouter as Router, Route} from "react-router-dom";

import {mainListItems, secondaryListItems} from './components/navigation';
import style from "./style";

const Skeleton: React.FC = () => {
    const classes = style();
    const [open, setOpen] = React.useState(true);
    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <Router>
            <div className={classes.root}>
                <CssBaseline/>
                <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
                    <Toolbar className={classes.toolbar}>
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Typography component="h1" variant="h6" color="inherit" noWrap={true} className={classes.title}>
                            Dashboard
                        </Typography>
                        <IconButton color="inherit">
                            <Badge badgeContent={4} color="secondary">
                                <NotificationsIcon/>
                            </Badge>
                        </IconButton>
                        <IconButton color="inherit">
                            <Badge color="secondary">
                                <PersonIcon/>
                            </Badge>
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Drawer
                    variant="permanent"
                    classes={{paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose)}}
                    open={open}
                >
                    <div className={classes.toolbarIcon}>
                        <IconButton onClick={handleDrawerClose}>
                            <ChevronLeftIcon/>
                        </IconButton>
                    </div>
                    <Divider/>
                    <List>{mainListItems}</List>
                    <Divider/>
                    <List>{secondaryListItems}</List>
                </Drawer>
                <main className={classes.content}>
                    <div className={classes.appBarSpacer}/>
                    <Container maxWidth="lg" className={classes.container}>
                        <Grid container={true} spacing={3}>
                            <Route exact={true} path="/" component={() => <div>Dasboard</div>}/>
                            <Route path="/users" component={() => <div>Benutzer</div>}/>
                            <Route path="/userPermissions" component={() => <div>Berechtigungen</div>}/>
                            <Route path="/actors" component={() => <div>Aktoren</div>}/>
                            <Route path="/machines" component={() => <div>Maschinen</div>}/>
                            <Route path="/places" component={() => <div>Orte</div>}/>
                            <Route path="/accessDevices" component={() => <div>Zugriffsgeräte</div>}/>
                            <Route path="/bookings" component={() => <div>Buchungen</div>}/>
                            <Route path="/settings" component={() => <div>Einstellungen</div>}/>
                        </Grid>
                    </Container>
                </main>
            </div>
        </Router>
    );
};

export default Skeleton;