import React from 'react';
import { connect } from 'react-redux';

import classes from './NavigationItems.module.css';
import NavigationItem from './NavigationItem/NavigationItem';
import Auxillary from '../../../hoc/Auxillary/Auxillary';

const navigationItems = (props) => {
    let notAuthRoutes = (
        <Auxillary>
            <NavigationItem link="/auth/signup" exact>Signup</NavigationItem>
            <NavigationItem link="/auth/login" exact>Login</NavigationItem>
        </Auxillary>
    );
    
    let authRoutes = (
        <Auxillary>
            <span className={classes.Dropdown}>
                <NavigationItem link="#">Body <i className="fa fa-angle-down"></i></NavigationItem>
                <div className={classes.DropdownItems}>
                    <NavigationItem link="/body" exact>View</NavigationItem>
                    <NavigationItem link="/body/add-data" exact>Add data</NavigationItem>
                </div>
            </span>
            <span className={classes.Dropdown}>
                <NavigationItem link="#">Exercise <i className="fa fa-angle-down"></i></NavigationItem>
                <div className={classes.DropdownItems}>
                    <NavigationItem link="/exercise" exact>View</NavigationItem>
                    <NavigationItem link="/exercise/add-exercise" exact>Add exercise</NavigationItem>
                </div>
            </span>
            <NavigationItem link="/logout" exact>Logout</NavigationItem>
        </Auxillary>
    );

    return (
        <ul className={classes.NavigationItems}>
            <NavigationItem link="/" exact>Home</NavigationItem>
            {!props.isAuthenticated ? notAuthRoutes : null}
            {props.isAuthenticated ? authRoutes : null}
        </ul>
    )
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.userToken !== null
    };
};

export default connect(mapStateToProps, null)(navigationItems);