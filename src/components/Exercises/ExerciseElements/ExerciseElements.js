import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import axiosExercise from '../../../axios-exercise';
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

    const [exercises, setAddExercise] = useState([]); // This is a showcase array (for front end)
    const [exercisePool, setExercisePool] = useState([]); // For initialization and deletion (This is an array that gets populated from backend)

    // TODO: At the beginning, populate the exercises array from the backend (DONE ?)
    useEffect(() => {
        fetchData();
    }, [props.token]);

    const fetchData = () => {
        let config = {
            headers: {
                'Authorization': 'Bearer ' + props.token
            }
        };

        let fetchedData = [];
        axiosExercise.get('', config).then(response => {
            fetchedData = response.data.result.map(data => {
                return {
                    id: data._id,
                    userId: data.userId,
                    name: data.name
                }
            });

            // TODO (DONE ?)
            let initialExercises = [];
            setExercisePool(fetchedData);
            initialExercises = fetchedData.map(data => {
                return data.name;
            });
            setAddExercise(initialExercises);
        });
        
    }

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
        const exercise = {
            name: newExercise.value
        };
        let config = {
            headers: {
                'Authorization': 'Bearer ' + props.token
            }
        };
        axiosExercise.post('', exercise, config).then(response => {
            // TODO: This is a problem
            //fetchData();
            console.log(response);
        }).catch(error => {
            console.log(error);
        });
    }

    const onRemoveExercise = (exerciseName) => {
        let copiedExercisesArr = [...exercises];

        copiedExercisesArr = copiedExercisesArr.filter(exercise => {
            return exercise !== exerciseName
        });

        setAddExercise(copiedExercisesArr);

        // http request (delete)
        // Get the id from poolInventory and send it to the backend
        let id = null;
        let exerciseToBeDeleted = {};
        exerciseToBeDeleted = exercisePool.filter(ex => ex.name === exerciseName);
        id = exerciseToBeDeleted[0].id;
        let config = {
            headers: {
                'Authorization': 'Bearer ' + props.token
            }
        };
        axiosExercise.delete('/' + id, config).then(result => {
            fetchData();
        });
    }

    const onSendFormFields = (event, exerciseName) => {
        event.preventDefault();

        props.onAddFormControl(exerciseName);

        // Remove the given exercise from the array
        let copiedExercisesArr = [...exercises];

        copiedExercisesArr = copiedExercisesArr.filter(exercise => {
            return exercise !== exerciseName
        });

        setAddExercise(copiedExercisesArr);
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
            <div>
                <h2>Add a new exercise to the pool</h2>
                <div className={classes.ExerciseElementAdd}>
                    <Input 
                        elementType={newExercise.elementType}
                        elementConfig={newExercise.elementConfig}
                        value={newExercise.value}
                        changed={(event) => onNewExerciseInputChangedHandler(event)}
                    />
                    <Button btnType="Success" type="ContentButton" clicked={onAddExerciseHandler} disabled={newExercise.value.length <= 0}>ADD</Button>
                </div>
            </div>
            <div className={classes.ExercisePool}>
                {exercisePoolContent}
            </div>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        token: state.userToken
    };
};

export default connect(mapStateToProps, null)(ExerciseElements);
