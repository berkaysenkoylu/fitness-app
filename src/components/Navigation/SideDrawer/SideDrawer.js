import React from 'react';

import classes from './SideDrawer.module.css';
import NavigationItems from '../NavigationItems/NavigationItems';
import Logo from '../../Logo/Logo';
import Auxillary from '../../../hoc/Auxillary/Auxillary';
import Backdrop from '../../UI/Backdrop/Backdrop';

const sideDrawer = (props) => {
    let attachedClassess = [classes.SideDrawer, classes.Closed];
    if(props.open) {
        attachedClassess = [classes.SideDrawer, classes.Open];
    }

    return (
        <Auxillary>
            <Backdrop show={props.open} clicked={props.closed} />
            <div className={attachedClassess.join(' ')} onClick={props.closed}>
                <div className={classes.Logo}>
                    <Logo />
                </div>
                <nav>
                    <NavigationItems />
                </nav>
            </div>
        </Auxillary>
    )
}

export default sideDrawer;
