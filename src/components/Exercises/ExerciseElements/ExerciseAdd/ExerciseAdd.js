import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import axiosExerciseRoutine from '../../../../axios-exerciseRoutine';

import Auxillary from '../../../../hoc/Auxillary/Auxillary';
import Button from '../../../UI/Button/Button';
import classes from './ExerciseAdd.module.css';
import ExerciseFormElement from '../../../../components/Exercises/ExerciseElements/ExerciseFormElement/ExerciseFormElement';

const ExerciseAdd = (props) => {
    const [formData, setFormData] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);
    const [formSubmitted, setIsFormSubmitted] = useState(false);
    let dateInput = React.createRef();

    useEffect(() => {
        const newFormControls = [...props.exerciseFormControls];

        //*
        const newFormData = {...formData};
        newFormControls.forEach(control => {
            if(!formData[control])
                newFormData[control] = {sets: '', reps: ''};
        });
        if(newFormControls.length > 0)
            validateForm(newFormData);

        setFormData(newFormData);

        
        //*

        // setFormControls(newFormControls);
    }, [props.exerciseFormControls]);

    // const onRemovePressed = (event, ctrName) => {
    //     event.preventDefault();

    //     let copiedFormCtrls = [...formControls];

    //     copiedFormCtrls = copiedFormCtrls.filter(ctrl => ctrl !== ctrName);

    //     setFormControls(copiedFormCtrls);

    //     props.onRemoveExercise(ctrName);
    // }

    const onRemovePressed = (event, formControl) => {
        event.preventDefault();

        const copiedFormData = {...formData};

        delete copiedFormData[formControl];

        setFormData(copiedFormData);

        props.onRemoveExercise(formControl);
    }

    const onInputFieldChanged = (event, formControl, inputFieldName) => {
        const copiedFormData = {...formData};
        const copiedFormControl = copiedFormData[formControl];

        switch (inputFieldName) {
            case 'sets':
                copiedFormControl.sets = event.target.value;
                copiedFormData[formControl] = copiedFormControl;
                setFormData(copiedFormData);
                break;
            case 'reps':
                copiedFormControl.reps = event.target.value;
                copiedFormData[formControl] = copiedFormControl;
                setFormData(copiedFormData);
                break;
            default:
                console.log("inputFieldName doesn't exist, check your code.");
                break;
        }

        // setIsFormValid(isValid);
        validateForm(formData);
    }

    const onDateChangedHandler = (event) => {
        validateForm(formData);
    }

    //*
    const validateForm = (form) => {
        // Validate each field
        let isValid = true;
        Object.keys(form).forEach(formControl => {
            isValid = isValid && (validateField(form[formControl].sets) && (validateField(form[formControl].reps)));
        });

        // Also check the date field
        if(!dateInput.current){
            isValid = false;
        } else {
            isValid = (dateInput.current.value.trim() !== '') && isValid;
        }

        // Set form valid
        setIsFormValid(isValid);
    }

    const validateField = (value) => {
        // Check if the given value is a number
        let regExp = new RegExp("^[0-9]+$");

        return regExp.test(value);
    }

    const onFormSubmitHandler = (event) => {
        event.preventDefault();

        
        const exerciseRoutineData = {
            date: new Date(dateInput.current.value),
            exercises: {
                ...formData
            }
        };

        const config = {
            headers: {
                'Authorization': 'Bearer ' + props.token
            }
        }
        axiosExerciseRoutine.post('', exerciseRoutineData, config).then(response => {
            // Redirect if successfull
            setIsFormSubmitted(true);
        }).catch(error => {
            console.log(error);
        });
    }

    // let form = <p>Add exercise form fields from the pool above.</p>;
    // if(formControls.length > 0) {
    //     form = formControls.map(formControl => {
    //         return (<div className={classes.FormFields} key={formControl}>
    //                     <label>{formControl}</label>
    //                     <input type="text" placeholder="Number of Sets" />
    //                     <input type="text" placeholder="Number of Repetitions" />
    //                     <button onClick={(event) => onRemovePressed(event, formControl)}>REMOVE</button>
    //                 </div>)
    //     });
    // }

    let formFields = <p>Add exercise form fields from the pool above.</p>;
    if(Object.keys(formData).length > 0) {
        formFields = Object.keys(formData).map(formCtrl => {
            return (
                // <div className={classes.FormFields} key={formCtrl}>
                //     <label>{formCtrl}</label>
                //     <input type="text" placeholder="Number of Sets" value={formData[formCtrl].sets} onChange={(event) => onInputFieldChanged(event, formCtrl, 'sets')} />
                //     <input type="text" placeholder="Number of Repetitions" value={formData[formCtrl].reps} onChange={(event) => onInputFieldChanged(event, formCtrl, 'reps')} />
                //     <button onClick={(event) => onRemovePressed(event, formCtrl)}>REMOVE</button>
                // </div>
                <ExerciseFormElement 
                    key={formCtrl} 
                    label={formCtrl} 
                    setsValue={formData[formCtrl].sets} 
                    repsValue={formData[formCtrl].reps} 
                    setsChanged={(event) => onInputFieldChanged(event, formCtrl, 'sets')}
                    repsChanged={(event) => onInputFieldChanged(event, formCtrl, 'reps')}
                    onRemoved={(event) => onRemovePressed(event, formCtrl)}
                    />
            )
        })
    }

    let redirectLink = null;
    if (formSubmitted){
        redirectLink = <Redirect to="/exercise" />;
    }

    return (
        <Auxillary>
            {redirectLink}
            <h2>Exercise addition form</h2>
            <div>
                <form className={classes.ExerciseForm} onSubmit={(event) => onFormSubmitHandler(event)}>
                    <input type="date" className={classes.DateInput} ref={dateInput} onInput={(event) => onDateChangedHandler(event)} />
                    {formFields}
                    <Button btnType="Success" disabled={!isFormValid}>Submit</Button>
                    {!isFormValid ? <p>Please make sure to enter numbers in the fields!</p> : null}
                </form>
            </div>
        </Auxillary>
    )
}

const mapStateToProps = state => {
    return {
        token: state.userToken
    };
};

export default connect(mapStateToProps, null)(ExerciseAdd);