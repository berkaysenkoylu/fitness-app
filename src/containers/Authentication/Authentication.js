import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Login from './Login/Login';
import Signup from './Signup/Signup';

class Authentication extends Component {
    render() {
        return (
            <div>
                <Switch>
                    <Route path={this.props.match.url + "/login"} component={Login} />
                    <Route path={this.props.match.url + "/signup"} exact component={Signup} />
                    <Redirect to="/" />
                </Switch>
            </div>
        )
    }
}

export default Authentication;