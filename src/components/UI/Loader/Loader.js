import React from 'react';

import classes from './Loader.module.css';

const squareLoader = (props) => {
    return (
        <div className={classes.LoaderContainer}>
            <div style={{margin: 'auto'}}>
                <div className={classes.Loader}></div>
                <div className={classes.Loader}></div>
                <div className={classes.Loader}></div>
                <div className={classes.Loader}></div>
                <div className={classes.Loader}></div>
            </div>
        </div>
    )
}

export default squareLoader;
