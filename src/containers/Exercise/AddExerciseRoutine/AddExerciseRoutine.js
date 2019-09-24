import React, { Component } from 'react';

import ExerciseElements from '../../../components/Exercises/ExerciseElements/ExerciseElements';
import ExerciseAdd from '../../../components/Exercises/ExerciseElements/ExerciseAdd/ExerciseAdd';

class AddExerciseRoutine extends Component {
    state = {
        formControls: [],
        removedExercise: null
    }

    getExerciseFormControls = (formControlName) => {
        // A function for obtaining the exercise form controls
        // from 'ExerciseElements' child component
        const copiedFormControlsArr = [...this.state.formControls];

        copiedFormControlsArr.push(formControlName);

        this.setState({
            formControls: copiedFormControlsArr
        });
    }

    removeExerciseHandler = (removedCtrName) => {
        let copiedFormControls = [...this.state.formControls];
        copiedFormControls = copiedFormControls.filter(ctrl => ctrl !== removedCtrName);

        this.setState({
            formControls: copiedFormControls,
            removedExercise: removedCtrName
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevState.removedExercise !== null)
        {    this.setState({
                removedExercise: null
            });
        }
    }

    render() {
        return (
            <div>
                <ExerciseElements onAddFormControl={this.getExerciseFormControls} removedExercise={this.state.removedExercise} />
                <hr />
                <ExerciseAdd exerciseFormControls={this.state.formControls} onRemoveExercise={this.removeExerciseHandler} />
            </div>
        )
    }
}

export default AddExerciseRoutine;