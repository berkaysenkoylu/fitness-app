import React from 'react';

import classes from './Input.module.css';

const input = (props) => {
    let inputElement = null;
    let inputClasses = [classes.InputElement];
    let validationError = '';

    if (!props.isValid && props.touched) {
        inputClasses.push(classes.Invalid);
        if(props.value !== ''){
            validationError = 'Please enter a valid value';
        }
        else {
            validationError = 'This field is required';
        }
    }

    switch(props.elementType) {
        case 'input':
            inputElement = <input 
                className={inputClasses.join(' ')} 
                {...props.elementConfig}
                value={props.value} 
                onChange={props.changed}
            />;
            break;
        case 'textarea':
            inputElement = <textarea 
                className={inputClasses.join(' ')} 
                {...props.elementConfig} 
                value={props.value} 
                onChange={props.changed}
            />;
            break;
        case 'select':
            inputElement = <select 
                className={inputClasses.join(' ')} 
                value={props.value} 
                onChange={props.changed}>
                    {props.elementConfig.options.map(option => (
                        <option key={option.value} value={option.value}>{option.displayValue}</option>
                    ))}
                </select>;
            break;
        default:
            inputElement = <input 
                className={inputClasses.join(' ')} 
                {...props.elementConfig}
                value={props.value} 
                onChange={props.changed}
            />;
            break;
    }

    return (
        <div className={classes.Input}>
           <label className={classes.Label}>{props.label}</label>
            {inputElement}
            <p className={classes.ValidationError}>{validationError}</p>
        </div>
    )
}

export default input;