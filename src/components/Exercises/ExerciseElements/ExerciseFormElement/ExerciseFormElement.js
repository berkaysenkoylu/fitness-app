import React from 'react';

import classes from './ExerciseFormElement.module.css';

const ExerciseFormElement = (props) => {
    return (
        <div className={classes.FormElement}>
            <label>{props.label}</label>
            <input type="text" placeholder="Number of Sets" value={props.setsValue} onChange={props.setsChanged} />
            <input type="text" placeholder="Number of Repetitions" value={props.repsValue} onChange={props.repsChanged} />
            <button onClick={props.onRemoved} className={classes.RemoveButton}>REMOVE</button>
        </div>
    )
}

export default ExerciseFormElement;
