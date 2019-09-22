import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import BodyData from './BodyData/BodyData';
import BodyView from '../../components/Body/BodyView';

class Body extends Component {
    render() {
        return (
            <Switch>
                <Route path={this.props.match.url + '/add-data'} component={BodyData} />
                <Route path={this.props.match.url} render={() => <BodyView {...this.props} />} />;
            </Switch>
        )
    }
}

export default Body;