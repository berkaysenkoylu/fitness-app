import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import './App.css';

import Home from './components/Home/Home';
import Body from './containers/Body/Body';
import Exercise from './containers/Exercise/Exercise';
import Authentication from './containers/Authentication/Authentication';
import Logout from './containers/Authentication/Logout/Logout';
import Layout from './hoc/Layout/Layout';

import * as actions from './store/actions/index';

class App extends Component {
  componentDidMount() {
    this.props.tryToAutoLogin();
  }
  
  render() {
    let routes = (
      <Switch>
        <Route path='/auth' component={Authentication} />
        <Route path='/exercise' component ={Exercise} />
        <Route path='/' exact component={Home} />
        <Redirect to='/' />
      </Switch>
    );

    if(this.props.isAuthenticated) {
      routes = (
        <Switch>
          <Route path='/logout' component={Logout} />
          <Route path='/auth' component={Authentication} />
          <Route path='/body' component={Body} />
          <Route path='/' exact component={Home} />
          <Redirect to='/' />
        </Switch>
      );
    }

    return (
      <div className="App">
        <Layout>
          {routes}
        </Layout>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.userToken !== null
  }
}

const mapDispatchToProps = dispatch => {
  return {
    tryToAutoLogin: () => {dispatch(actions.authCheckState())}
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);