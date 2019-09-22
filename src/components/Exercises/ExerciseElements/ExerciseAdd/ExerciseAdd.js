import React, { useState, useEffect } from 'react';

import Auxillary from '../../../../hoc/Auxillary/Auxillary';
import classes from './ExerciseAdd.module.css';

const ExerciseAdd = (props) => {
    const [formControls, setFormControls] = useState([]);
    const [formData, setFormData] = useState({});
    // [{'pullup': {sets: 1, reps: 10}} , {'pushup': {sets: 2, reps: 10}}]

    useEffect(() => {
        const newFormControls = [...props.exerciseFormControls];

        //*
        const newFormData = {};
        newFormControls.forEach(control => {
            newFormData[control] = {sets: 0, reps: 0};
        });
        console.log(newFormData);
        //*

        setFormControls(newFormControls);
    }, [props.exerciseFormControls]);

    const onRemovePressed = (event, ctrName) => {
        event.preventDefault();

        let copiedFormCtrls = [...formControls];

        copiedFormCtrls = copiedFormCtrls.filter(ctrl => ctrl !== ctrName);

        setFormControls(copiedFormCtrls);

        props.onRemoveExercise(ctrName);
    }

    let form = <p>Add exercise form fields from the pool above.</p>;
    if(formControls.length > 0) {
        form = formControls.map(formControl => {
            return (<div className={classes.FormFields} key={formControl}>
                        <label>{formControl}</label>
                        <input type="text" placeholder="Number of Sets" />
                        <input type="text" placeholder="Number of Repetitions" />
                        <button onClick={(event) => onRemovePressed(event, formControl)}>REMOVE</button>
                    </div>)
        });
    }

    return (
        <Auxillary>
            <h2>Exercise addition form</h2>
            <div className={classes.ExerciseForm}>
                <form style={{padding: '10px'}}>
                    <input type="date" />
                    {form}
                </form>
            </div>
        </Auxillary>
    )
}

export default ExerciseAdd;