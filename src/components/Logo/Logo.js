import React from 'react';

import fitnessLogo from '../../assets/images/logo.png';
import classes from './Logo.module.css';

const logo = (props) => {
    return (
        <div className={classes.Logo} style={{height: props.height}}>
            <img src={fitnessLogo} alt="logo" />
        </div>
    )
}

export default logo;
