import React, { Component } from 'react';
import {
  BrowserRouter as Router, Switch, Route,
} from 'react-router-dom';
import IndexHome from './pages/index/Home';
import Page404 from './pages/common/Page404';
class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/" exact component={IndexHome} />
          <Route component={Page404} />
        </Switch>
      </Router>
    );
  }
}

export default App;
