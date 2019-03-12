import React, { Component } from 'react';
import {
  BrowserRouter as Router, Switch, Route,
} from 'react-router-dom';
import IndexHome from './pages/index/Home';
import Page404 from './pages/common/Page404';
import AdminIndex from "./pages/admin/Index";
import AdminAuthRoute from "./utils/AdminAuth";

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/" exact component={IndexHome} />
          <AdminAuthRoute path="/admin" exact component={AdminIndex} />
          <Route component={Page404} />
        </Switch>
      </Router>
    );
  }
}

export default App;
