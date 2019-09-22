import React, { useState, useEffect } from 'react';

import classes from './ExerciseElements.module.css';
import ExerciseElement from './ExerciseElement/ExerciseElement';
import Input from '../../UI/Input/Input';
import Button from '../..//UI/Button/Button';

const ExerciseElements = (props) => {
    const [newExercise, setNewExercise] = useState({
        elementType: 'input',
        elementConfig: {
            type: 'text',
            placeholder: 'New Exercise'
        },
        value: ''
    });

    const [exercises, setAddExercise] = useState([]);

    // TODO: At the beginning, populate the exercises array from the backend


    // When a form field has been removed, re-add the exercise residing in that to the pool
    useEffect(() => {
        if(props.removedExercise !== null){
            let copiedExercisesArr = [...exercises];

            copiedExercisesArr.push(props.removedExercise);

            setAddExercise(copiedExercisesArr);
        }
    }, [props.removedExercise]);

    const onNewExerciseInputChangedHandler = (event) => {
        const copiedForm = {...newExercise};
        copiedForm.value = event.target.value;

        setNewExercise(copiedForm);
    }

    const onAddExerciseHandler = () => {
        let copiedExercisesArr = [...exercises];

        copiedExercisesArr.push(newExercise.value);

        setAddExercise(copiedExercisesArr);

        // Reset the form
        const copiedForm = {...newExercise};
        copiedForm.value = '';
        setNewExercise(copiedForm);

        // http request (post)
    }

    const onRemoveExercise = (exerciseName) => {
        let copiedExercisesArr = [...exercises];

        copiedExercisesArr = copiedExercisesArr.filter(exercise => {
            return exercise !== exerciseName
        });

        setAddExercise(copiedExercisesArr);

        // http request (delete)
    }

    const onSendFormFields = (event, exercise) => {
        event.preventDefault();

        props.onAddFormControl(exercise);

        onRemoveExercise(exercise);
    }

    let exercisePoolContent = null;
    if (exercises.length <= 0){
        exercisePoolContent = <p style={{gridColumnStart: '2', gridColumnEnd: '3'}}>You haven't added any exercises yet!</p>
    } 
    else {
        exercisePoolContent = exercises.map(exercise => {
            return (<div key={exercise} style={{minHeight: "0"}}>
                        <ExerciseElement name={exercise} onCancel={() => onRemoveExercise(exercise)} onAdd={(event) => onSendFormFields(event, exercise)} />
                    </div>
                )
        });
    }

    return (
        <div className={classes.ExerciseElements}>
            <div className={classes.ExercisePool}>
                {exercisePoolContent}
            </div>
            <div>
                <h2>Add a new exercise to the pool</h2>
                <div>
                    <Input 
                        elementType={newExercise.elementType}
                        elementConfig={newExercise.elementConfig}
                        value={newExercise.value}
                        changed={(event) => onNewExerciseInputChangedHandler(event)}
                    />
                </div>
                <Button btnType="Success" type="ContentButton" clicked={onAddExerciseHandler} disabled={newExercise.value.length <= 0}>ADD</Button>
            </div>
        </div>
    )
}

export default ExerciseElements;
