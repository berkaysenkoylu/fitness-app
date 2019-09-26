import React from 'react';

import classes from './Home.module.css';

const Home = () => {
    return (
        <div>
            <div className={classes.HomeImage}></div>
            <div className={classes.HomeTextBox}>
                <h1 className={classes.PrimaryHeading}>
                    <span className={classes.PrimaryHeadingMain}>FITNESS TRACKER</span>
                    <span className={classes.PrimaryHeadingSub}>track your progress</span>
                    <span className={classes.PrimaryHeadingSub}>improve better</span>
                </h1>
            </div>
        </div>
    )
}

export default Home;