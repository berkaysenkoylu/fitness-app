import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import AddExerciseRoutine from './AddExerciseRoutine/AddExerciseRoutine';
import ExerciseView from '../../components/Exercises/ExerciseView/ExerciseView';

class Exercise extends Component {
    render() {
        return (
            <Switch>
                <Route path={this.props.match.url + '/add-exercise'} component={AddExerciseRoutine} />
                <Route path={this.props.match.url} component={ExerciseView} />
            </Switch>
        )
    }
}

export default Exercise;