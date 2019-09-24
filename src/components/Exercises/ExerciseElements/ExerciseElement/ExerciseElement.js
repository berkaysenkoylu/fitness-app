import React from 'react';

import classes from './ExerciseElement.module.css';

const ExerciseElement = (props) => {
    return (
        <div className={classes.ExerciseElement}>
            <label onClick={props.onAdd}>{props.name}</label>
            <span style={{flex: "1 auto"}} onClick={props.onAdd}></span>
            <button onClick={props.onCancel}>X</button>
        </div>
    )
}

export default ExerciseElement;
